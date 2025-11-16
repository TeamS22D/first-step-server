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
      throw new UnauthorizedException({ message: "이메일이나 비밀번호를 확인해주십시오" }); // 이메일이 없거나 일치하지 않음
    }

    const samePassword = await bcrypt.compare(password, user.password);

    if (!samePassword) {
      throw new UnauthorizedException({ message: "이메일이나 비밀번호를 확인해주십시오" }); // 비밀번호가 일치하지 않음
    }

    const payload = { id: user.id, email: user.email };

    // 엑세스토큰, refresh토큰 발급
    const accessToken = this.jwtService.sign(payload, { expiresIn: '300s' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '1d' });

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userService.updateRefreshToken(user.id, hashedRefreshToken);

    return { email, accessToken, refreshToken };
  }

  // 엑세스 토큰 재발급
  async refresh(userId: number, refreshToken: string) {
    const user = await this.userService.findById(userId);

    if (!user || !user.refreshToken) {
      throw new UnauthorizedException({ message: "유저가 존재하지 않거나 토큰이 없습니다." }); // 유저가 없거나 유저 정보에 refresh 토큰 없음
    }

    const isMatch = await bcrypt.compare(refreshToken, user.refreshToken);

    if (!isMatch) {
      throw new UnauthorizedException({ message: "토큰이 일치하지 않습니다." }); // 토큰이 일치하지 않다면
    }
    
    const payload = { id: user.id };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }
}
