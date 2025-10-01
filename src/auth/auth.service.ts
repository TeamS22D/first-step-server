import {
  UnauthorizedException
} from '@nestjs/common'

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SocialUserDto } from './dto/social-user.dto';
import { AuthDTO } from './dto/auth-dto';
import { Provider } from './dto/social-user.dto';
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
        if (user.provider !== "email") {
        throw new UnauthorizedException({message: `이 이메일은 ${user.provider}로 가입되어 있습니다.`})
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

  async socialLogin(userDto: SocialUserDto, provider: Provider) {
    const { email, socialId } = userDto;
    
    const user = await this.userService.findByEmail(email);
    // console.log(user?.provider, provider);
    if (user && user.provider != provider) {
      throw new UnauthorizedException({message: `이 이메일은 ${user.provider}로 가입되어 있습니다.`})
    }

    if (!user) { // 가입한 적이 없다면 회원가입
      return this.userService.socialSingup(userDto, userDto.provider);
    }
    


    console.log('소셜 로그인 유저 정보:', userDto);
    const payload = { email: email, sub: socialId };
    const accessToken = this.jwtService.sign(payload);
    return { message: '로그인 성공', accessToken };
  }
}