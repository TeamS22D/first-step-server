import { IsEmail, IsString, IsEnum, IsOptional } from 'class-validator';

export enum Provider {
  GOOGLE = 'google',
  NAVER = 'naver',
  KAKAO = 'kakao',
  LOCAL = 'local',
}

export class SocialUserDto {
  @IsString()
  socialId: string;

  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  profileImage?: string;

  @IsEnum(Provider)
  provider: Provider;
}
