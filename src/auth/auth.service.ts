import {
  UnauthorizedException
} from '@nestjs/common'

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SocialUserDto } from './dto/social-user.dto';
import { AuthDTO } from './dto/auth-dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';



@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService, 
    private readonly userService: UserService
  ) {}

  async signin(autoDTO: AuthDTO.SignIn) {
    const { email, password } = autoDTO

    const user = await this.userService.findByEmail(email);
        if (!user) {
          throw new UnauthorizedException({message: "이메일이나 비밀번호를 확인해주십시오"})
        }
        const samePassword = bcrypt.compareSync(password, user.password)
        if (!samePassword) {
          throw new UnauthorizedException({message: "이메일이나 비밀번호를 확인해주십시오"})
        }
    
        const payload = {
          id: user.id,
        }

        const accessToken = this.jwtService.sign(payload);

        return {'accessToken': accessToken}

  }

  async socialLogin(userDto: SocialUserDto) {
    console.log('소셜 로그인 유저 정보:', userDto);
    const payload = { email: userDto.email, sub: userDto.socialId };
    const accessToken = this.jwtService.sign(payload);
    return { message: '로그인 성공', accessToken };
  }
}