import { RawGradingResult } from './raw-grading-result.dto';
import { IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class FeedbackRequestDto {
  @ValidateNested()
  @Type(() => RawGradingResult)
  rawResult: RawGradingResult;

  @IsNumber()
  userMissionId: number;
}
