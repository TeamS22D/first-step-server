import { IsNumber, IsOptional, IsString } from 'class-validator';

export namespace MissionDTO {
  export class createMission {
    @IsString()
    missionName: string;

    @IsString()
    missionTheme: string;

    @IsString()
    body: string;

    @IsString()
    description: string;

    @IsOptional()
    @IsString()
    referenceAnswer?: string | null;

    @IsNumber()
    rubricId: number;
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
