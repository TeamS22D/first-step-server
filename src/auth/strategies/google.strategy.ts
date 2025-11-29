import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Provider, SocialUserDto } from '../dto/social-user.dto';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.get('GOOGLE_CLIENT_ID')!,
      clientSecret: configService.get('GOOGLE_CLIENT_SECRET')!,
      callbackURL: configService.get('GOOGLE_CALLBACK_URL')!,
      scope: ['email', 'profile'],
      passReqToCallback: true,
    });
  }

  async validate(
    req: any,
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any,
  ): Promise<any> {

    console.log('===== Google Profile =====');
    console.log(profile);
    console.log('==========================');

    if (!profile) {
      return done(new Error('구글 프로필 정보 못 받음.'), null);
    }

    const { id, name, emails, photos } = profile;
    const user: SocialUserDto = {
      socialId: id,
      email: emails[0].value,
      name: name.givenName,
      profileImage: photos[0].value,
      provider: Provider.GOOGLE,
    };
    done(null, user);
  }
}

