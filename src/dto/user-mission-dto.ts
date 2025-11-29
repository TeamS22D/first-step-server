import { IsDate, IsInt, IsNumber } from 'class-validator';

export namespace UserMissionDTO {
  export class createUserMission {
    @IsInt()
    userId: number;

    @IsInt()
    missionId: number;
  }

  export class readUserMission {
    @IsNumber()
    user_mission_id: number;

    @IsInt()
    user_id: number;

    @IsInt()
    mission_id: number;
  }

  export class updateUserMission {
    @IsDate()
    startDate: Date;

    @IsDate()
    endDate: Date;
  }

}
