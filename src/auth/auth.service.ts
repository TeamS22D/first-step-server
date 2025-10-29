import { 
  Injectable, 
  UnauthorizedException
  } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UserService } from 'src/user/user.service';
import { AuthDTO } from './dto/auth-dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  // 로그인
  async signin(authDTO: AuthDTO.SignIn) {
    const { email, password } = authDTO;

    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException({ message: '이메일이나 비밀번호를 확인해주십시오' });
    }

    const samePassword = await bcrypt.compare(password, user.password);
    if (!samePassword) {
      throw new UnauthorizedException({ message: '이메일이나 비밀번호를 확인해주십시오' });
    }

    const payload = { id: user.id };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userService.updateRefreshToken(user.id, hashedRefreshToken);

    return { email, accessToken, refreshToken };
  }

  // 엑세스 토큰 재발급
  async refresh(userId: number, refreshToken: string) {
    const user = await this.userService.findById(userId)
    if (!user || !user.refreshToken) {
      throw new UnauthorizedException({ message: '유저가 존재하지 않거나 토큰이 없습니다.' });
    }

    const isMatch = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!isMatch) {
      throw new UnauthorizedException({ message: '토큰이 일치하지 않습니다.' })
    }
    
    const payload = { id: user.id }
    const accessToken = this.jwtService.sign(payload)
    return { accessToken }
  }
}
