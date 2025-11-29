import { 
  Injectable, 
  ConflictException,
  BadRequestException,
  NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserEntity } from './entities/user.entity';
import { AuthDTO } from 'src/auth/dto/auth-dto';

@Injectable()
export class UserService {
  constructor(@InjectRepository(UserEntity) private userRepository: Repository<UserEntity>) {}

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

  async findById(id: number) {
    return await this.userRepository.findOne({ where: { id }});
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email }});
  }

  async checkEmail(authDTO: AuthDTO.CheckEmail) {
    const { email } = authDTO;

    const has = await this.findByEmail(email);
    if (has) throw new ConflictException({ message: '이메일이 이미 사용 중입니다' });
      return { message: '사용 가능한 이메일입니다.' };
  }

  async signup(authDTO: AuthDTO.SignUp) {
    const { email } = authDTO;

    if (await this.findByEmail(email)) {
      throw new ConflictException({ message: '이메일이 이미 사용 중입니다' });
    }

    const user = this.userRepository.create(authDTO);
    const saved = await this.userRepository.save(user);

    return { message: '회원가입이 완료되었습니다', email: email, userId: saved.id };
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
        attendanceStreak: MoreThan(myStreak)
      }
    });

    const myRank = betterThanMe + 1;

    const percentile = (myRank / totalUsers) * 100;

    return {
      name : user.name,
      streak : myStreak,
      rank : myRank,
      totalUsers : totalUsers,
      percentile : percentile.toFixed(2),
    }
  }
}