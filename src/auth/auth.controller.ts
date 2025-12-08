import {
  Controller,
  Post,
  Body,
  Get,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { SignInDto } from './dto/auth-dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import type { Response } from 'express';
import { Provider } from './dto/social-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signin')
  async signin(@Body() authDTO: SignInDto) {
    return this.authService.signin(authDTO);
  }

  @Post('/refresh')
  async refresh(@Body() body: { userId: number; refreshToken: string }) {
    return this.authService.refresh(body.userId, body.refreshToken);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res: Response) {
    const { accessToken } = await this.authService.socialLogin(
      req.user,
      Provider.GOOGLE,
    );
    
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    
    res.redirect(`${frontendUrl}/login-success?token=${accessToken}`);
  }

  @Get('naver')
  @UseGuards(AuthGuard('naver'))
  async naverAuth(@Req() req) {}

  @Get('naver/callback')
  @UseGuards(AuthGuard('naver'))
  async naverAuthRedirect(@Req() req, @Res() res: Response) {
    const { accessToken } = await this.authService.socialLogin(
      req.user,
      Provider.NAVER,
    );
    
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    
    res.redirect(`${frontendUrl}/login-success?token=${accessToken}`);
  }

  @Get('kakao')
  @UseGuards(AuthGuard('kakao'))
  async kakaoAuth(@Req() req) {}

  @Get('kakao/callback')
  @UseGuards(AuthGuard('kakao'))
  async kakaoAuthRedirect(@Req() req, @Res() res: Response) {
    const { accessToken } = await this.authService.socialLogin(
      req.user,
      Provider.KAKAO,
    );
    
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    
    res.redirect(`${frontendUrl}/login-success?token=${accessToken}`);
  }
}