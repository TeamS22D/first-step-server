import { IsEnum, IsNotEmpty } from 'class-validator';
import { GraphRange } from '../enums/graph-range.enum';

export class ProfileGraphDto {
  @IsNotEmpty()
  @IsEnum(GraphRange)
  range: GraphRange;
}