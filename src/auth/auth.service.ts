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

// AuthController에서 기대하는 반환 타입
interface RefreshResult {
  newAccessToken: string;
  newRefreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

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

    const accessToken = this.jwtService.sign({ type: 'access', ...payload });
    const refreshToken = this.jwtService.sign({ type: 'refresh', ...payload }, { expiresIn: '7d' });

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userService.updateRefreshToken(user.userId, hashedRefreshToken);

    return { email, accessToken, refreshToken };
  }

  async refresh(userId: number, refreshToken: string): Promise<RefreshResult> {
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
    
    // 새 액세스 토큰과 리프레시 토큰을 모두 생성합니다.
    const newAccessToken = this.jwtService.sign(
      { type: 'access', ...payload },
      { expiresIn: '15m' },
    );
    const newRefreshToken = this.jwtService.sign(
      { type: 'refresh', ...payload },
      { expiresIn: '7d' },
    );

    // DB에 새로운 리프레시 토큰을 해시하여 저장합니다.
    const hashedNewRefreshToken = await bcrypt.hash(newRefreshToken, 10);
    await this.userService.updateRefreshToken(user.userId, hashedNewRefreshToken);

    // AuthController가 기대하는 형식으로 두 토큰을 모두 반환합니다.
    return { newAccessToken, newRefreshToken };
  }

  async socialLogin(userDto: SocialUserDto, provider: Provider) {
    const { email } = userDto;

    let user = await this.userService.findByEmail(email);

    if (user) {
      if (user.provider !== provider) {
        throw new UnauthorizedException({
          message: `이 이메일은 ${user.provider}로 가입되어 있습니다.`,
        });
      }
    } else {
      user = await this.userService.socialSignup(userDto, provider);
    }
    
    const payload = { id: user.userId };

    const accessToken = this.jwtService.sign({ ...payload, type: 'access' });
    const refreshToken = this.jwtService.sign({ ...payload, type: 'refresh' }, { expiresIn: '7d' });

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userService.updateRefreshToken(user.userId, hashedRefreshToken);

    return { email, accessToken, refreshToken };
  }
}