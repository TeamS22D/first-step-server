import {
  Controller,
  Body,
  ConflictException,
  Post,
  Get,
  Req,
  UseGuards,
  Delete,
  Patch,
  HttpCode,
} from '@nestjs/common';

import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import type { Request } from 'express';
import { CheckEmailDto, SignUpDto, UpdateUserDto } from 'src/auth/dto/auth-dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/check-email')
  @HttpCode(200)
  async checkemail(@Body() authDTO: CheckEmailDto) {
    return await this.userService.checkEmail(authDTO); // 이메일 확인
  }

  @Post('/signup')
  async signup(@Body() authDTO: SignUpDto) {
    return await this.userService.signup(authDTO); // 회원가입
  }

  @UseGuards(AuthGuard)
  @Get('/')
  getProfile(@Req() req: Request) {
    return req.user; // 로그인 확인
  }

  @UseGuards(AuthGuard)
  @Delete('/delete-user')
  async deleteUser(@Req() req: Request) {
    return this.userService.deleteUser(req.user?.['userId']); // 유저 삭제
  }

  @UseGuards(AuthGuard)
  @Patch('/update-user')
  async updateUser(@Req() req: Request, @Body() dto: Partial<UpdateUserDto>) {
    const userId = req.user?.['userId'];
    return this.userService.updateUser(userId, dto); // 유저 업데이트
  }

  @UseGuards(AuthGuard)
  @Post('/attendance')
  async attendance(@Req() req: Request) {
    const userId = (req.user as any).userId;
    return await this.userService.checkAttendance(userId);
  }

  @UseGuards(AuthGuard)
  @Get('/attendance/rank')
  async getAttendanceRank(@Req() req: Request) {
    const userId = (req.user as any).id;
    return await this.userService.getAttendanceRank(userId);
  }

  @UseGuards(AuthGuard)
  @Post('/occupation')
  @HttpCode(200)
  async updateOccupation(
    @Req() req: Request,
    @Body() dto: Partial<UpdateUserDto>,
  ) {
    const userId = req.user?.['userId'];
    return await this.userService.updateUser(userId, dto);
  }

  @UseGuards(AuthGuard)
  @Post('/job')
  @HttpCode(200)
  async updateJob(@Req() req: Request, @Body() dto: Partial<UpdateUserDto>) {
    const userId = req.user?.['userId'];
    return await this.userService.updateUser(userId, dto);
  }

  @UseGuards(AuthGuard)
  @Get('/profile/percent')
  @HttpCode(200)
  getPercent(@Req() req: Request) {
    const userId = req.user?.['userId'];
    return 1; // 임시 설정
  }

  @UseGuards(AuthGuard)
  @Get('/todaysMission/:userId')
  async todaysMission(@Req() req: Request) {
    const userId = (req.user as any).id;
    return await this.userService.todaysMission(userId);
  }
}
