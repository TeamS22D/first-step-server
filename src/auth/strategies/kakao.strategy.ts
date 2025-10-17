import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Provider, SocialUserDto } from '../dto/social-user.dto';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.get('KAKAO_CLIENT_ID')!,
      callbackURL: configService.get('KAKAO_CALLBACK_URL')!,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any,
  ): Promise<any> {

    console.log('===== Kakao Profile =====');
    console.log(JSON.stringify(profile, null, 2));
    console.log('=========================');

    if (!profile) {
      return done(new Error('카카오 프로필 정보 못 받음.'), null);
    }

    const { id, _json } = profile;
    const user: SocialUserDto = {
      socialId: id.toString(),
      email: _json.kakao_account.email,
      name: _json.properties.nickname,
      profileImage: _json.properties.profile_image,
      provider: Provider.KAKAO,
    };
    done(null, user);
  }
}

