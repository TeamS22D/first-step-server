import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserEntity } from "src/user/entities/user.entity";
import { UserService } from "src/user/user.service";

export interface Payload {
  id: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET ?? 'fallback-secret', // dev에서 undefined 방지용
    });
  }

  async validate(payload: Payload): Promise<UserEntity> {
    const user = await this.userService.findById(payload.id);
    if (!user) {
      throw new UnauthorizedException({ message: '회원 존재하지 않음' });
    }
    return user;
    }
}