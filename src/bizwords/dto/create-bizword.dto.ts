import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateBizwordDto {
  @IsString()
  @IsNotEmpty()
  
  term: string; // 용어

  @IsString()
  @IsNotEmpty()
  meaning: string; // 의미

  @IsString()
  @IsOptional()
  example?: string; // 예문
}