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

    if (has) throw new ConflictException({ message: '이메일이 이미 사용 중입니다.' });

    return { message: '사용 가능한 이메일입니다.' };
  }

  async signup(authDTO: AuthDTO.SignUp) {
    const { email, password, checkPassword } = authDTO;

    if (await this.findByEmail(email)) {
      throw new ConflictException({ message: '이메일이 이미 사용 중입니다.' });
    }

    if (!(/[@]/.test(email))) {
      throw new ConflictException({ message: "이메일 형식과 맞지 않습니다."})
    }

    if (!password) {
      throw new ConflictException({ message: "비밀번호를 입력해 주세요."})
    }

    if (password != checkPassword) {
      throw new ConflictException({ message: '비밀번호가 일치하지 않습니다.' })
    }

    if (!(/[a-z*+&$#@$!~₩/0-9]/.test(password)) || /[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(password) || password.length > 20 || password.length < 7) {
      throw new ConflictException({ message: '비밀번호는 7~20자로 영문 대소문자, 숫자, 특수기호를 조합해서 사용하세요.'})
    }

    const user = this.userRepository.create(authDTO);
    const saved = await this.userRepository.save(user);

    return { message: '회원가입이 완료되었습니다.', email: email, userId: saved.id };
  }
}
