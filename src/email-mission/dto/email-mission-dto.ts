import { IsNumber, IsString } from "class-validator";

export namespace EmailMissionDTO {
    export class createDTO {
        @IsString()
        title: string;

        @IsString()
        emailContent: string;

        @IsString()
        missionId: number;
    }

    export class updateDTO {
        @IsNumber()
        emailMissionId: number;

        @IsString()
        title: string;

        @IsString()
        emailContent: string;

        @IsNumber()
        missionId: number;

        @IsNumber()
        userMissionId: number;
    }

    export class sendDTO {
        @IsString()
        title: string;

        @IsString()
        emailContent: string;
    }
}