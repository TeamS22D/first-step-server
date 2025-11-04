import { 
  Injectable, 
  ConflictException 
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { AuthDTO } from 'src/auth/dto/auth-dto';

@Injectable()
export class UserService {
  constructor(@InjectRepository(UserEntity) private userRepository: Repository<UserEntity>) {}

  async updateRefreshToken(userId: number, token: string) {
    await this.userRepository.update(userId, { refreshToken: token });
  }

  async findById(id: number) {
    return await this.userRepository.findOne({ where: { id }});
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email }});
  }

  async checkEmail(authDTO: AuthDTO.CheckEmail) {
    const { email } = authDTO;

    const has = await this.findByEmail(email);
    if (has) throw new ConflictException({ message: '이메일이 이미 사용 중입니다' });
      return { message: '사용 가능한 이메일입니다.' };
  }

  async signup(authDTO: AuthDTO.SignUp) {
    const { email } = authDTO;

    if (await this.findByEmail(email)) {
      throw new ConflictException({ message: '이메일이 이미 사용 중입니다' });
    }

    const user = this.userRepository.create(authDTO);
    const saved = await this.userRepository.save(user);

    return { message: '회원가입이 완료되었습니다', email: email, userId: saved.id };
  }
}
