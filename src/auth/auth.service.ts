import {
  Injectable,
  UnauthorizedException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UserService } from 'src/user/user.service';
import { SignInDto } from '../dto/auth-dto';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  // 로그인
  async signin(authDTO: SignInDto) {
    const { email, password } = authDTO;

    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException({
        message: '이메일이나 비밀번호를 확인해주십시오',
      });
    }

    const samePassword = await bcrypt.compare(password, user.password);
    if (!samePassword) {
      throw new UnauthorizedException({
        message: '이메일이나 비밀번호를 확인해주십시오',
      });
    }

    const payload = { id: user.userId };

    // 엑세스토큰, refresh토큰 발급
    const accessToken = this.jwtService.sign({ ...payload, type: 'access' });
    const refreshToken = this.jwtService.sign({ ...payload, type: 'refresh' }, { expiresIn: '7d' });

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userService.updateRefreshToken(user.userId, hashedRefreshToken);

    return { email, accessToken, refreshToken };
  }

  // 엑세스 토큰 재발급
  async refresh(userId: number, refreshToken: string) {
    const user = await this.userService.findById(userId);
    if (!user || !user.refreshToken) {
      throw new UnauthorizedException({
        message: '유저가 존재하지 않거나 토큰이 없습니다.',
      });
    }

    const isMatch = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!isMatch) {
      throw new UnauthorizedException({ message: '토큰이 일치하지 않습니다.' });
    }

    const payload = { id: user.userId };
    const accessToken = this.jwtService.sign({ payload, type: 'access' });
    return { accessToken };
  }
}
