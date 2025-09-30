import {
    IsEmail,
    IsString,
    Length
} from 'class-validator'

export namespace AuthDTO {
	export class SignUp {
        @IsEmail()
        email: string;

        @IsString()
        @Length(7, 20)
        password: string;

        @IsString()
        name: string;
    }

    export class SignIn {
        @IsEmail()
        email: string;

        @IsString()
        @Length(7, 20)
        password: string;
    }

    export class CheckEmail {
        @IsEmail()
        email: string;
    }
}