import {
  Controller,
  Body, 
  Post, 
  Get, 
  Req, 
  UseGuards,
  Delete,
  Patch,
  } from '@nestjs/common';

import { UserService } from './user.service';
import { AuthDTO } from 'src/auth/dto/auth-dto';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

  @Post('/checkemail')
  async checkemail(@Body() authDTO: AuthDTO.CheckEmail) {
    return await this.userService.checkEmail(authDTO); // 이메일 확인
  }

  @Post('/signup')
  async signup(@Body() authDTO: AuthDTO.SignUp) {
    return await this.userService.signup(authDTO); // 회원가입
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/')
  async getProfile(@Req() req: Request) {
    return req.user; // 로그인 확인
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/deleteUser')
  async deleteUser(@Req() req: Request) {
    return this.userService.deleteUser(req.user?.['id']); // 유저 삭제
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('/updateUser')
  async updateUser(@Req() req: Request, @Body() dto: Partial<AuthDTO.SignUp>) {
    const userId = req.user?.['id'];
    return this.userService.updateUser(userId, dto); // 유저 업데이트
  }
}