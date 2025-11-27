import {
    IsBoolean,
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

        @IsString()
        @Length(7, 20)
        checkPassword: string;
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

    export class CheckVerified {
        @IsBoolean()
        isVerified: boolean;
    }
}