import { IsNumber, IsString } from "class-validator";

export namespace DocumentMissionDto {
    export class createDTO {
        @IsString()
        documentContent: string;

        @IsNumber()
        userMissionId: number;
    }

    export class updateDTO {
        @IsNumber()
        documentMissionId: number;

        @IsString()
        documentContent: string;

        @IsNumber()
        userMissionId: number;
    }

    export class sendDTO {
        @IsString()
        documentContent: string;
    }
}