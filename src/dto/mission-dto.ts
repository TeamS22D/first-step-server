import { IsNumber, IsOptional, IsString } from 'class-validator';

export namespace MissionDTO {
  export class createMission {
    @IsString()
    missionName: string;

    @IsString()
    missionTheme: string;

    @IsString()
    body: string;

    @IsOptional()
    @IsString()
    description?: string | null;

    @IsOptional()
    @IsString()
    referenceAnswer?: string | null;

    @IsNumber()
    rubricId: number;
  }

  export class readMission {
    @IsNumber()
    missionId: number;

    @IsString()
    missionName: string;

    @IsString()
    missionTheme: string;
  }

  export class updateMission {
    @IsNumber()
    missionId: number;

    @IsString()
    missionName: string;

    @IsString()
    missionTheme: string;

    @IsString()
    rubricId: number;

    @IsString()
    body: string;

    @IsString()
    referenceAnswer: string;

    @IsString()
    description: string;
  }

  export class deleteMission {
    @IsNumber()
    missionIdww: number;
  }
}
