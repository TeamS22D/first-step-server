import {
  Controller,
  Post,
  Body,
  Get,
  Req,
  Res,
  UseGuards,
  UnauthorizedException,
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

  @Get('/refresh') 
  async refresh(
    @Req() req: any,
    @Res() res: Response,
  ) {
    const refreshToken = req.cookies['refreshToken'];
    const userId = req.user?.['userId'] || req.user?.['id'];

    if (!refreshToken) {
      throw new UnauthorizedException('리프레시 토큰이 쿠키에 없습니다.');
    }

    const { newAccessToken, newRefreshToken } = await this.authService.refresh(
      userId, 
      refreshToken,
    );
    
    const maxAge = 7 * 24 * 60 * 60 * 1000;
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: maxAge,
    });

    return res.json({ accessToken: newAccessToken });
  }

  private async handleSocialLoginRedirect(req: any, res: Response, provider: Provider) {
    const { accessToken, refreshToken } = await this.authService.socialLogin(
      req.user,
      provider,
    );

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const maxAge = 7 * 24 * 60 * 60 * 1000;

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: maxAge,
    });
    
    res.redirect(`${frontendUrl}/login-success?token=${accessToken}`);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res: Response) {
    await this.handleSocialLoginRedirect(req, res, Provider.GOOGLE);
  }

  @Get('naver')
  @UseGuards(AuthGuard('naver'))
  async naverAuth(@Req() req) {}

  @Get('naver/callback')
  @UseGuards(AuthGuard('naver'))
  async naverAuthRedirect(@Req() req, @Res() res: Response) {
    await this.handleSocialLoginRedirect(req, res, Provider.NAVER);
  }

  @Get('kakao')
  @UseGuards(AuthGuard('kakao'))
  async kakaoAuth(@Req() req) {}

  @Get('kakao/callback')
  @UseGuards(AuthGuard('kakao'))
  async kakaoAuthRedirect(@Req() req, @Res() res: Response) {
    await this.handleSocialLoginRedirect(req, res, Provider.KAKAO);
  }
}