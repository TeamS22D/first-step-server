import {
  Controller,
  Body, 
  Post, 
  Get, 
  Req, 
  UseGuards,
  } from '@nestjs/common';

import { UserService } from './user.service';
import { AuthDTO } from 'src/auth/dto/auth-dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import type { Request } from 'express';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

  @Post('/checkemail')
  async checkemail(@Body() authDTO: AuthDTO.CheckEmail) {
    return await this.userService.checkEmail(authDTO);
  }

  @Post('/signup')
  async signup(@Body() authDTO: AuthDTO.SignUp) {
    console.log('[controller] signup body=', authDTO);
    return await this.userService.signup(authDTO);
  }

  @UseGuards(AuthGuard)
  @Get('/')
  async getProfile(@Req() req: Request) {
    return req.user;
  }
}
