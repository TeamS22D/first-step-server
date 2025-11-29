import {
  Injectable,
  ConflictException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import { CheckEmailDto, SignUpDto } from '../dto/auth-dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async updateRefreshToken(userId: number, token: string) {
    await this.userRepository.update(userId, { refreshToken: token });
  }

  async findById(userId: number) {
    return await this.userRepository.findOne({ where: { userId } });
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email } });
  }

  // 이메일 중복 확인
  async checkEmail(authDTO: CheckEmailDto) {
    const { email } = authDTO;

    const has = await this.findByEmail(email);

    if (has)
      throw new ConflictException({ message: '이메일이 이미 사용 중입니다.' });

    return { message: '사용 가능한 이메일입니다.' };
  }

  // 회원가입
  async signup(authDTO: SignUpDto) {
    const { email, password, checkPassword } = authDTO;

    if (await this.findByEmail(email)) {
      throw new ConflictException({ message: '이메일이 이미 사용 중입니다.' }); // 이메일 중복
    }

    // 이메일 정규식 (간단 버전)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // 비밀번호 정규식
    const pwdRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*~₩])[A-Za-z\d!@#$%^&*~₩]{7,20}$/;

    // 이메일/비밀번호 필수값 체크
    if (!email || !password || !checkPassword) {
      throw new BadRequestException({
        message: '이메일과 비밀번호를 모두 입력해 주세요.',
      });
    }

    // 이메일 형식 체크 (@, 도메인 포함)
    if (!emailRegex.test(email)) {
      throw new BadRequestException({
        message: '이메일 형식과 맞지 않습니다.',
      });
    }

    // 비밀번호 동일 여부
    if (password !== checkPassword) {
      throw new BadRequestException({
        message: '비밀번호가 일치하지 않습니다.',
      });
    }

    // 비밀번호 형식 체크
    if (!pwdRegex.test(password)) {
      throw new BadRequestException({
        message: '비밀번호는 7~20자, 영문/숫자/특수문자 조합이어야 합니다.',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      ...authDTO,
      password: hashedPassword,
    });
    const saved = await this.userRepository.save(user);

    return {
      message: '회원가입이 완료되었습니다.',
      email: email,
      userId: saved.userId,
    };
  }

  async deleteUser(userId: number) {
    const user = await this.findById(userId);

    if (!user)
      throw new NotFoundException({ message: '사용자를 찾을 수 없습니다.' });

    await this.userRepository.delete(userId);

    return { message: '사용자가 정상적으로 삭제되었습니다.' };
  }

  async updateUser(userId: number, authDTO: Partial<SignUpDto>) {
    const { email, name, password, checkPassword } = authDTO;

    const user = await this.findById(userId);

    if (!user)
      throw new NotFoundException({ message: '사용자를 찾을 수 없습니다.' });

    const updateData: Partial<UserEntity> = {};

    // 이메일 업데이트 (선택)
    if (email !== undefined) {
      const emailTrim = email.trim();

      if (emailTrim.length === 0) {
        throw new BadRequestException({
          message: '이메일은 빈 값으로 변경할 수 없습니다.',
        });
      }

      // 이메일 형식 체크
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailTrim)) {
        throw new BadRequestException({
          message: '이메일 형식과 맞지 않습니다.',
        });
      }

      // 중복 체크 (본인 제외)
      const existing = await this.findByEmail(emailTrim);
      if (existing && existing.userId !== userId) {
        throw new ConflictException({
          message: '이미 사용 중인 이메일입니다.',
        });
      }

      updateData['email'] = emailTrim;
    }

    // 이름 업데이트 (선택)
    if (typeof name === 'string' && name.trim().length > 0) {
      updateData['name'] = name.trim();
    }

    // 비밀번호 업데이트 (선택)
    if (password !== undefined || checkPassword !== undefined) {
      // 둘 중 하나라도 비어있으면 오류
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

      // 비밀번호 정규식
      const pwdRegex =
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*~₩])[A-Za-z\d!@#$%^&*~₩]{7,20}$/;
      if (!pwdRegex.test(password)) {
        throw new BadRequestException({
          message: '비밀번호는 7~20자, 영문/숫자/특수문자 조합이어야 합니다.',
        });
      }

      updateData['password'] = await bcrypt.hash(password, 10);
    }

    // 변경할 데이터가 하나도 없으면
    if (Object.keys(updateData).length === 0) {
      throw new BadRequestException({ message: '변경할 정보가 없습니다.' });
    }

    await this.userRepository.update(userId, updateData);

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
}
