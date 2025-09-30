import { 
  Controller, 
  Get,
  Post, 
  Body,
  Req,
  UseGuards,
  UnauthorizedException
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { AuthDTO } from './dto/auth-dto';
import { UserService } from 'src/user/user.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UserService, private readonly jwtService: JwtService) {}

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
}