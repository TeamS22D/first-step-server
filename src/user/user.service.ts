import {
  ConflictException
} from '@nestjs/common'

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from './entities/user.entity';
import { AuthDTO } from 'src/auth/dto/auth-dto';
import { SocialUserDto } from 'src/auth/dto/social-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async signup(authDTO: AuthDTO.SignUp | AuthDTO.SocialSignUp, provider: "email" | "google" | "kakao" | "naver") {
    const { email, ...rest } = authDTO;
    const hasEmail = await this.findByEmail(email);
    if (hasEmail) {
      throw new ConflictException({message : "이메일이 이미 사용 중입니다"});
    }
    const userEntity = this.userRepository.create({
      provider: provider,
      ...rest,
      email,
    });

    await this.userRepository.save(userEntity);

    return {
      message: "회원가입이 완료되었습니다.",
      user: {
        email: email,
        name: rest.name
      }
    };
  }

  async socialSingup(userDto: SocialUserDto, provider: "email" | "google" | "kakao" | "naver") {
    const authDTO: AuthDTO.SocialSignUp = {
      email: userDto.email,
      name: userDto.name
    };

    return await this.signup(authDTO, provider);
    
  }

  async findById (id: number) {
    return await this.userRepository.findOne({where: {id}});
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOne({where: {email}});
  }
}
