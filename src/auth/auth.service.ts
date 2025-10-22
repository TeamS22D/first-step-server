import { 
  Inject,
  Injectable, 
  UnauthorizedException
  } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UserService } from 'src/user/user.service';
import { AuthDTO } from './dto/auth-dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async signin(authDTO: AuthDTO.SignIn) {
    const { email, password } = authDTO;

    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException({ message: '이메일이나 비밀번호를 확인해주십시오' });
    }

    const samePassword = await bcrypt.compare(password, user.password);
    if (!samePassword) {
      throw new UnauthorizedException({ message: '이메일이나 비밀번호를 확인해주십시오' });
    }

    const payload = { id: user.id };

    const accessToken = this.jwtService.sign(payload);

    return { message: email };
  }
}
