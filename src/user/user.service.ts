import {
  Injectable,
  ConflictException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserEntity } from './entities/user.entity';
import { Provider, SocialUserDto } from 'src/auth/dto/social-user.dto';
import { CheckEmailDto, SignUpDto, UpdateUserDto } from '../auth/dto/auth-dto';
import { Job } from './types/job.enum';
import { Occupation } from './types/occupation.enum';
import { UserMission } from 'src/user-mission/entities/user-mission.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(UserMission)
    private userMissionRepository: Repository<UserMission>,
  ) {}

  async updateRefreshToken(userId: number, token: string) {
    let hashedToken: string | null = null;
    
    if (token) {
      hashedToken = await bcrypt.hash(token, 10);
    }

    await this.userRepository.update(userId, { refreshToken: hashedToken as any });
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: number) {
    const user = await this.findById(userId);
    if (!user || !user.refreshToken) return null;
    
    const isMatch = await bcrypt.compare(refreshToken, user.refreshToken);
    if (isMatch) {
      return user;
    }
    return null;
  }

  async findById(userId: number) {
    return await this.userRepository.findOne({ where: { userId } });
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email } });
  }

  async checkEmail(authDTO: CheckEmailDto) {
    const { email } = authDTO;

    const has = await this.findByEmail(email);

    if (has)
      throw new ConflictException({ message: '이메일이 이미 사용 중입니다.' });

    return { message: '사용 가능한 이메일입니다.' };
  }

  async signup(authDTO: SignUpDto) {
    const { email, password, checkPassword } = authDTO;

    if (await this.findByEmail(email)) {
      throw new ConflictException({ message: '이메일이 이미 사용 중입니다.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const pwdRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*~₩])[A-Za-z\d!@#$%^&*~₩]{7,20}$/;

    if (!email || !password || !checkPassword) {
      throw new BadRequestException({
        message: '이메일과 비밀번호를 모두 입력해 주세요.',
      });
    }

    if (!emailRegex.test(email)) {
      throw new BadRequestException({
        message: '이메일 형식과 맞지 않습니다.',
      });
    }

    if (password !== checkPassword) {
      throw new BadRequestException({
        message: '비밀번호가 일치하지 않습니다.',
      });
    }

    if (!pwdRegex.test(password)) {
      throw new BadRequestException({
        message: '비밀번호는 7~20자, 영문/숫자/특수문자 조합이어야 합니다.',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      ...authDTO,
      password: hashedPassword,
      provider: Provider.LOCAL,
    });
    const saved = await this.userRepository.save(user);

    return {
      message: '회원가입이 완료되었습니다.',
      email: email,
      userId: saved.userId,
    };
  }

  async updateProvider(userId: number, provider: Provider) {
    await this.userRepository.update(userId, { provider: provider });
    return this.findById(userId);
  }

  async socialSignup(userDto: SocialUserDto, provider: Provider) {
    const { email, name } = userDto;
    
    let user = await this.findByEmail(email);

    if (user) {
        if (user.provider === Provider.LOCAL) {
            user = await this.updateProvider(user.userId, provider);
            return user;
        }
        throw new ConflictException({ message: `이미 ${user.provider} 계정으로 사용 중인 이메일입니다.` });
    }

    const userEntity = this.userRepository.create({
      email,
      provider,
      name,
      isVerified: true,
    });

    return await this.userRepository.save(userEntity);
  }

  async deleteUser(userId: number) {
    const user = await this.findById(userId);

    if (!user)
      throw new NotFoundException({ message: '사용자를 찾을 수 없습니다.' });

    await this.userRepository.delete(userId);

    return { message: '사용자가 정상적으로 삭제되었습니다.' };
  }

  async updateUser(userId: number, authDTO: Partial<UpdateUserDto>) {
    const { email, name, password, checkPassword, job, occupation } = authDTO;

    const user = await this.findById(userId);

    if (!user)
      throw new NotFoundException({ message: '사용자를 찾을 수 없습니다.' });

    const updateData: Partial<UserEntity> = {};

    if (email !== undefined) {
      const emailTrim = email.trim();

      if (emailTrim.length === 0) {
        throw new BadRequestException({
          message: '이메일은 빈 값으로 변경할 수 없습니다.',
        });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailTrim)) {
        throw new BadRequestException({
          message: '이메일 형식과 맞지 않습니다.',
        });
      }

      const existing = await this.findByEmail(emailTrim);
      if (existing && existing.userId !== userId) {
        throw new ConflictException({
          message: '이미 사용 중인 이메일입니다.',
        });
      }

      updateData['email'] = emailTrim;
    }

    if (job) {
      const trimmed = job.trim();
      if (Object.values(Job).includes(trimmed as Job)) {
        updateData['job'] = trimmed as Job;
      }
    }

    if (occupation) {
      const trimmed = occupation.trim();
      if (Object.values(Occupation).includes(trimmed as Occupation)) {
        updateData['occupation'] = trimmed as Occupation;
      }
    }

    if (typeof name === 'string' && name.trim().length > 0) {
      updateData['name'] = name.trim();
    }

    if (password !== undefined || checkPassword !== undefined) {
      if (!password || !checkPassword) {
        throw new BadRequestException({
          message: '비밀번호와 확인 비밀번호를 모두 입력해 주세요.',
        });
      }

      if (password !== checkPassword) {
        throw new BadRequestException({
          message: '비밀번호가 일치하지 않습니다.',
        });
      }

      const pwdRegex =
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*~₩])[A-Za-z\d!@#$%^&*~₩]{7,20}$/;
      if (!pwdRegex.test(password)) {
        throw new BadRequestException({
          message: '비밀번호는 7~20자, 영문/숫자/특수문자 조합이어야 합니다.',
        });
      }

      updateData['password'] = await bcrypt.hash(password, 10);
    }

    if (Object.keys(updateData).length === 0) {
      throw new BadRequestException({ message: '변경할 정보가 없습니다.' });
    }

    Object.assign(user, updateData);

    await this.userRepository.save(user);

    return { message: '사용자 정보가 정상적으로 업데이트되었습니다.' };
  }

  async checkAttendance(userId: number) {
    const user = await this.findById(userId);

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastDate = user.lastAttendanceDate
      ? new Date(user.lastAttendanceDate)
      : null;

    if (lastDate) {
      lastDate.setHours(0, 0, 0, 0);

      const timeDiff = today.getTime() - lastDate.getTime();
      const dayDiff = timeDiff / (1000 * 3600 * 24);

      if (dayDiff === 0) {
        throw new BadRequestException('이미 오늘 출석체크를 완료했습니다.');
      }

      if (dayDiff === 1) {
        user.attendanceStreak += 1;
      } else {
        user.attendanceStreak = 1;
      }
    } else {
      user.attendanceStreak = 1;
    }

    user.lastAttendanceDate = today;
    await this.userRepository.save(user);

    return {
      message: '출석체크 완료!',
      streak: user.attendanceStreak,
    };
  }

  async getAttendanceRank(userId: number) {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    const myStreak = user.attendanceStreak;

    const totalUsers = await this.userRepository.count();

    const betterThanMe = await this.userRepository.count({
      where: {
        attendanceStreak: MoreThan(myStreak),
      },
    });

    const myRank = betterThanMe + 1;

    const percentile = (myRank / totalUsers) * 100;

    return {
      name: user.name,
      streak: myStreak,
      rank: myRank,
      totalUsers: totalUsers,
      percentile: percentile.toFixed(2),
    };
  }

  async todaysMission(userId: number) {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const origin = await this.userMissionRepository.find({
      where: {
        user: { userId },
        endDate: MoreThan(now),
      },
      relations: ['mission']
    });

    if (!origin || origin.length === 0) {
      throw new BadRequestException({ message: '미션이 존재하지 않습니다.' });
    }

    const missions = origin.map((um) => ({
      userMissionId: um.userMissionId,
      missionName: um.mission.missionName,
      endDate: um.endDate,
    }));
    return missions;
  }

  async timeLine(userId: number, present: Date) {
    const origin = await this.userMissionRepository.find({
      where: {
        user: { userId },
        endDate: MoreThan(present),
      },
      relations: ['mission']
    });

    if (!origin || origin.length === 0) {
      throw new BadRequestException({ message: '미션이 존재하지 않습니다.' });
    }

    const missions = origin.map((um) => ({
      userMissionId: um.userMissionId,
      missionName: um.mission.missionName,
      compeleted: um.completed,
    }));
    return missions;
  }
}