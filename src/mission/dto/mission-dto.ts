import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { MissionTheme } from '../types/missoin-theme.enum';

export class createMissionDto {
  @IsString()
  missionName: string;

  @IsEnum(MissionTheme)
  missionTheme: MissionTheme;

  @IsString()
  body: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  situation?: string;

  @IsOptional()
  @IsString()
  tip?: string;

  @IsOptional()
  @IsString()
  referenceAnswer?: string;

  @IsNumber()
  rubricId: number;
}

export class readMissionDto {
  @IsNumber()
  missionId: number;

  @IsString()
  missionName: string;

  @IsString()
  missionTheme: string;
}

export class updateMissionDto {
  @IsEnum(MissionTheme, { message: "Invalid MissionTheme'})" })
  @IsOptional()
  missionTheme?: MissionTheme;

  @IsString()
  @IsOptional()
  rubricId?: number;

  @IsString()
  @IsOptional()
  body?: string;

  @IsString()
  @IsOptional()
  referenceAnswer?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
