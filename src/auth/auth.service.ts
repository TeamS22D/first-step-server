<<<<<<< HEAD

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SocialUserDto } from './dto/social-user.dto';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async socialLogin(userDto: SocialUserDto) {
    console.log('소셜 로그인 유저 정보:', userDto);
    const payload = { email: userDto.email, sub: userDto.socialId };
    const accessToken = this.jwtService.sign(payload);
    return { message: '로그인 성공', accessToken };
  }
}
=======
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
}
>>>>>>> origin/main
