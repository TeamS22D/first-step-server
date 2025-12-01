import { IsNumber, IsString } from "class-validator";

export namespace EmailMissionDTO {
    export class createDTO {
        @IsNumber()
        emailMissionId: number;

        @IsString()
        title: string;
    
        @IsString()
        sender: string;
    }

    export class updateDTO {
        @IsNumber()
        emailMissionId: number;

        @IsString()
        title: string;

        @IsString()
        sender: string;

        @IsString()
        emailContent: string;
    }
}