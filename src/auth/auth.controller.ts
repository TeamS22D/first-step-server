import { 
  Controller, 
  Get,
  Post, 
  Body,
  Req,
  Res,
  UseGuards,
  UnauthorizedException
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthGuard } from '@nestjs/passport';
import { AuthDTO } from './dto/auth-dto';
import { SocialUserDto } from './dto/social-user.dto';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import type { Response } from 'express';


@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UserService, private readonly jwtService: JwtService, private readonly authService: AuthService) {}

  @Post('/signin')
  async signin(@Body() authDTO: AuthDTO.SignIn) {
    const { email, password } = authDTO;

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

    return {'accessToken' : accessToken};
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res: Response) {
    const user = req.user;
    const result = await this.authService.socialLogin(user);
    res.status(200).json({ ...result, user });
  }

  @Get('naver')
  @UseGuards(AuthGuard('naver'))
  async naverAuth(@Req() req) {}

  @Get('naver/callback')
  @UseGuards(AuthGuard('naver'))
  async naverAuthRedirect(@Req() req, @Res() res: Response) {
    const user = req.user;
    const result = await this.authService.socialLogin(user);
    res.status(200).json({ ...result, user });
  }

  @Get('kakao')
  @UseGuards(AuthGuard('kakao'))
  async kakaoAuth(@Req() req) {}

  @Get('kakao/callback')
  @UseGuards(AuthGuard('kakao'))
  async kakaoAuthRedirect(@Req() req, @Res() res: Response) {
    const user = req.user;
    const result = await this.authService.socialLogin(user);
    res.status(200).json({ ...result, user });
  }


}

