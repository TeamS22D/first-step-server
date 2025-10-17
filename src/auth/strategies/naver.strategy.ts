import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-naver-v2';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Provider, SocialUserDto } from '../dto/social-user.dto';

@Injectable()
export class NaverStrategy extends PassportStrategy(Strategy, 'naver') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.get('NAVER_CLIENT_ID')!,
      clientSecret: configService.get('NAVER_CLIENT_SECRET')!,
      callbackURL: configService.get('NAVER_CALLBACK_URL')!,
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: any): Promise<any> {
    const { id, email, nickname, profile_image } = profile;
    const user: SocialUserDto = {
      socialId: id,
      email: email,
      name: nickname,
      profileImage: profile_image,
      provider: Provider.NAVER,
    };
    done(null, user);
  }
}