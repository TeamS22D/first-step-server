import { 
  Controller,
  Body,
  ConflictException,
  Post,
  Get,
  Req,
  UseGuards,
  Request
} from '@nestjs/common';

import { UserService } from './user.service';
import { AuthDTO } from 'src/auth/dto/auth-dto';
import { UserEntity } from './entities/user.entity';
import { AuthGuard } from 'src/auth/guard/auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/cheakemail')
  async cheakemail(@Body() authDTO: AuthDTO.CheakEmail) {
    const {email} = authDTO;

    const hasEmail = await this.userService.findByEmail(email);
    if (hasEmail) {
      throw new ConflictException("이메일이 이미 사용 중입니다")
    }

    return true;
  }

  @Post('/signup')
  async signup(@Body() authDTO: AuthDTO.SignUp) {
    const {email} = authDTO;

    const hasEmail = await this.userService.findByEmail(email);
    if (hasEmail) {
      throw new ConflictException("이메일이 이미 사용 중입니다")
    }

    const userEntity = await this.userService.create(authDTO)

    return "회원가입 성공";
  }

  @UseGuards(AuthGuard)
  @Get('/')
  async getProfile(@Req() req: any) {
    const user = req.user
    return user
  }
}
