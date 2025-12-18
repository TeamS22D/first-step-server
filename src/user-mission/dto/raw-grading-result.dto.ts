import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class RawGradingResult {
  @IsNumber()
  total_score: number;

  @IsString()
  grade: string;

  @IsString()
  general_feedback: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EvaluationDto)
  evaluations: EvaluationDto[];
}

export class EvaluationDto {
  @IsString()
  item: string;

  @IsNumber()
  score: number;

  feedback: any;
}