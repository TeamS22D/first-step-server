import {
  IsBoolean,
  IsEmail,
  IsString,
  Length
} from 'class-validator'

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