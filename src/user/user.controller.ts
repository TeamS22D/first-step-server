import { 
  Controller,
  Body,
  ConflictException,
  Post
} from '@nestjs/common';

import { UserService } from './user.service';
import { AuthDTO } from 'src/auth/dto/auth-dto';


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/signup')
  async signup(@Body() authDTO: AuthDTO.SignUp) {
    const {email, name} = authDTO;

    const hasEmail = await this.userService.findByEmail(email);
    if (hasEmail) {
      throw new ConflictException("이메일이 이미 사용 중입니다")
    }

    const userEntity = await this.userService.create(authDTO)

    return "회원가입 성공";
  }
}
