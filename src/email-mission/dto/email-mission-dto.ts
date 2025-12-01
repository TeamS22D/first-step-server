import { IsNumber, IsString } from "class-validator";

export namespace EmailMissionDTO {
    export class createDTO {
        @IsNumber()
        emailMissionId: number;

        @IsString()
        title: string;
    
        @IsNumber()
        userMissionId: number;
    }

    export class updateDTO {
        @IsNumber()
        emailMissionId: number;

        @IsString()
        title: string;

        @IsString()
        emailContent: string;

        @IsNumber()
        userMissionId: number;
    }
}