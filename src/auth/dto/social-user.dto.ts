export class SocialUserDto {
  socialId: string;
  email: string;
  name: string;
  profileImage?: string;
  provider: 'google' | 'naver' | 'kakao';
}