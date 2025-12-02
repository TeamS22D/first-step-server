import {
  UnauthorizedException,
  Injectable,
  Inject,
  forwardRef,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { SocialUserDto } from './dto/social-user.dto';
import { Provider } from './dto/social-user.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { SignInDto } from './dto/auth-dto';

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
    if (user.provider !== Provider.LOCAL) {
      throw new UnauthorizedException({
        message: `이 이메일은 ${user.provider}로 가입되어 있습니다.`,
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
    const accessToken = this.jwtService.sign(
      { type: 'access', ...payload },
      { expiresIn: '15m' },
    );
    const refreshToken = this.jwtService.sign(
      { type: 'refresh', ...payload },
      { expiresIn: '7d' },
    );

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
    const accessToken = this.jwtService.sign(
      { type: 'access', ...payload },
      { expiresIn: '15m' },
    );
    return { accessToken };
  }

  async socialLogin(userDto: SocialUserDto, provider: Provider) {
    const { email, socialId } = userDto;

    const user = await this.userService.findByEmail(email);
    // console.log(user?.provider, provider);
    if (user && user.provider != provider) {
      throw new UnauthorizedException({
        message: `이 이메일은 ${user.provider}로 가입되어 있습니다.`,
      });
    }

    if (!user) {
      // 가입한 적이 없다면 회원가입
      return this.userService.socialSignup(userDto, userDto.provider);
    }

    console.log('소셜 로그인 유저 정보:', userDto);
    const payload = { id: user.userId };

    // 엑세스토큰, refresh토큰 발급
    const accessToken = this.jwtService.sign(
      { type: 'access', ...payload },
      { expiresIn: '15m' },
    );
    const refreshToken = this.jwtService.sign(
      { type: 'refresh', ...payload },
      { expiresIn: '7d' },
    );

    return { email, accessToken, refreshToken };
  }
}
