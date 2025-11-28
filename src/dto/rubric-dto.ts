import { IsNumber, IsString } from 'class-validator';

export namespace RubricDto {
  export class createDto {
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