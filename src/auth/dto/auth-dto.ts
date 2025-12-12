import {
  IsBoolean,
  IsEmail, IsEnum, IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { Job } from '../../user/types/job.enum';
import { Occupation } from '../../user/types/occupation.enum';


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
  @IsOptional()
  job?: Job;

  @IsEnum(Occupation)
  @IsOptional()
  occupation?: Occupation;
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