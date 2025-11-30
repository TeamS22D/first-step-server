import {
  IsBoolean,
  IsEmail, IsEnum,
  IsString,
  Length,
} from 'class-validator';
import { Job } from '../../user/types/job.enum';
import { Occupation } from '../../user/types/occupation.enum';

// 네임스페이스(namespace AuthDTO)를 제거하고 개별 클래스로 export
export class SignUpDto {
  @IsEmail()
  email: string;

  @IsString()
  @Length(7, 20)
  password: string;

  @IsString()
  name: string;

  @IsString()
  @Length(7, 20)
  checkPassword: string;
}

export class UpdateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @Length(7, 20)
  password: string;

  @IsString()
  name: string;

  @IsString()
  @Length(7, 20)
  checkPassword: string;

  @IsEnum(Job)
  job?: Job | null;

  @IsEnum(Occupation)
  occupation?: Occupation | null;
}

export class SignInDto {
  @IsEmail()
  email: string;

  @IsString()
  @Length(7, 20)
  password: string;
}

export class CheckEmailDto {
  @IsEmail()
  email: string;
}

export class CheckVerifiedDto {
  @IsBoolean()
  isVerified: boolean;
}