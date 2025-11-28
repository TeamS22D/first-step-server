import { IsNumber, IsString } from 'class-validator';

export namespace RubricDto {
  export class createDto {
    @IsNumber()
    rubricId: number;

    @IsString()
    rubricName: string;

    @IsString()
    body: string;
  }

  export class updateDto {
    @IsNumber()
    rubricId: number;

    @IsString()
    rubricName: string;

    @IsString()
    body: string;
  }
}