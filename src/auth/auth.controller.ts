import { 
  Controller, 
  Post, 
  Body,
} from '@nestjs/common';

import { AuthDTO } from '../dto/auth-dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signin')
  async signin(@Body() authDTO: AuthDTO.SignIn) {
    return this.authService.signin(authDTO);
  }
  
  @Post('refresh')
  async refresh(@Body() body: { userId: number; refreshToken: string }) {
    return this.authService.refresh(body.userId, body.refreshToken);
  }
}
