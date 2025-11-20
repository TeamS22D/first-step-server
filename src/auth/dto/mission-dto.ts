import { 
    IsNumber, 
    IsString 
} from "class-validator";

export namespace MissionDTO {
    export class createMission {
        @IsString()
        mission_name: string;

        @IsString()
        mission_theme: string;

        @IsString()
        description: string;
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

    export class deelteMission {
        @IsNumber()
        mission_id: number;
    }
}