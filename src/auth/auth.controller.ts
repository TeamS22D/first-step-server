import { 
  Controller, 
  Get,
  Post, 
  Body,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import { AuthDTO } from './dto/auth-dto';
import { AuthService } from './auth.service';
import type { Response } from 'express';


@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}

  @Post('/signin')
  async signin(@Body() authDTO: AuthDTO.SignIn) {
      return this.authService.signin(authDTO)
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res: Response) {
    const user = req.user;
    const result = await this.authService.socialLogin(user);
    
    return { ...result, user };
  }

  @Get('naver')
  @UseGuards(AuthGuard('naver'))
  async naverAuth(@Req() req) {}

  @Get('naver/callback')
  @UseGuards(AuthGuard('naver'))
  async naverAuthRedirect(@Req() req, @Res() res: Response) {
    const user = req.user;
    const result = await this.authService.socialLogin(user);
  
    return { ...result, user };
  }

  @Get('kakao')
  @UseGuards(AuthGuard('kakao'))
  async kakaoAuth(@Req() req) {}

  @Get('kakao/callback')
  @UseGuards(AuthGuard('kakao'))
  async kakaoAuthRedirect(@Req() req, @Res() res: Response) {
    const user = req.user;
    const result = await this.authService.socialLogin(user);
    
    return {...result, user};
  }


}

