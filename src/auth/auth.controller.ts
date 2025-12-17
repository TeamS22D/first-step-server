import {
  Controller,
  Post,
  Body,
  Get,
  Req,
  Res,
  UseGuards,
  UnauthorizedException,
  Headers,
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
  async refresh(
    @Headers('Authorization') authHeader: string,
    @Res() res: Response,
  ) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Authorization 헤더 형식이 올바르지 않습니다.');
    }
    
    const refreshToken = authHeader.split(' ')[1];

    let userId: number;
    let tokenType: string;

    try {
      const payload = this.authService['jwtService'].decode(refreshToken);
      
      if (!payload) {
        throw new Error();
      }

      userId = payload['id'];
      tokenType = payload['type'];
    } catch (e) {
      throw new UnauthorizedException('유효하지 않은 토큰 형식입니다.');
    }

    if (!refreshToken || !userId) {
      throw new UnauthorizedException('토큰이 전달되지 않았거나 유저 ID를 확인할 수 없습니다.');
    }

    if (tokenType !== 'refresh') {
      throw new UnauthorizedException('리프레시 토큰이 아닙니다. (Access Token 사용 불가)');
    }

    const { newAccessToken, newRefreshToken } = await this.authService.refresh(
      userId, 
      refreshToken,
    );

    return res.status(200).json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  }

  private async handleSocialLoginRedirect(req: any, res: Response, provider: Provider) {
    const { userId, email, accessToken, refreshToken } = await this.authService.socialLogin(
      req.user,
      provider,
    );

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    
    const redirectUrl = `${frontendUrl}/login-success?token=${accessToken}&refreshToken=${refreshToken}&userId=${userId}&email=${email}`;

    res.redirect(redirectUrl);
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