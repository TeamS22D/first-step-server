import { IsNumber, IsOptional, IsString } from 'class-validator';

export namespace QuestionDto {
  export class createQuestion {
    @IsString()
    title: string;

    @IsString()
    theme: string;

    @IsString()
    body: string;

    @IsOptional()
    @IsString()
    referenceAnswer?: string | null;
  }

  export class readMission {
    @IsNumber()
    mission_id: number;

    @IsString()
    mission_name: string;

    @IsString()
    mission_theme: string;
  }

  export class updateMission {
    @IsNumber()
    mission_id: number;

    @IsString()
    mission_name: string;

    @IsString()
    mission_theme: string;

    @IsString()
    description: string;
  }

  export class deleteMission {
    @IsNumber()
    mission_id: number;
  }
}
