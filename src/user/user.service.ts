import { 
  Injectable, 
  ConflictException, 
  BadRequestException
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

  // 이메일 중복 확인
  async checkEmail(authDTO: AuthDTO.CheckEmail) {
    const { email } = authDTO;

    const has = await this.findByEmail(email);

    if (has) throw new ConflictException({ message: "이메일이 이미 사용 중입니다." });

    return { message: "사용 가능한 이메일입니다." };
  }

  // 회원가입
  async signup(authDTO: AuthDTO.SignUp) {
    const { email, password, checkPassword, } = authDTO;

    if (await this.findByEmail(email)) {
      throw new ConflictException({ message: "이메일이 이미 사용 중입니다." }); // 이메일 중복
    }

    if (!(/[@]/.test(email))) {
      throw new BadRequestException({ message: "이메일 형식과 맞지 않습니다."}) // 이메일에 @가 없다면
    }

    if (!email) throw new BadRequestException({ message: "이메일을 입력해 주세요."}) // 이메일 입력하지 않았다면
    if (!password) throw new BadRequestException({ message: "비밀번호를 입력해 주세요."}) // 비밀번호 입력하지 않았다면

    if (password != checkPassword) {
      throw new BadRequestException({ message: "비밀번호가 일치하지 않습니다." }) // 비밀번호랑 비밀번호 확인이랑 일치하지 않다면
    }

    const pwdRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*~₩])[A-Za-z\d!@#$%^&*~₩]{7,20}$/;
    if (!pwdRegex.test(password)) {
      throw new BadRequestException("비밀번호는 7~20자, 영문/숫자/특수문자 조합이어야 합니다."); // 비밀번호가 형식에 맞지 않다면
    }

    const user = this.userRepository.create(authDTO);
    const saved = await this.userRepository.save(user);

    return { message: "회원가입이 완료되었습니다.", email: email, userId: saved.id };
  }
}
