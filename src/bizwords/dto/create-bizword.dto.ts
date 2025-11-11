import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  ArrayMinSize,
} from 'class-validator';

export class CreateBizwordDto {

  @IsString()
  @IsNotEmpty()
  word: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  desc: string[];

  @IsOptional()
  @IsString()
  example: string;
}