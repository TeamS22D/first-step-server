import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from './strategies/google.strategy';
import { NaverStrategy } from './strategies/naver.strategy';
import { KakaoStrategy } from './strategies/kakao.strategy';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { JwtStrategy } from './security/passport.jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [UserModule, JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET', ''),
        signOptions: { expiresIn: '300s' },
      }),
    }),
    PassportModule
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    GoogleStrategy,
    NaverStrategy,
    KakaoStrategy,
  ],
})
export class AuthModule {}
