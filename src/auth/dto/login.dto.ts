import { IsEmail, IsNotEmpty, IsStrongPassword } from "class-validator";

export class LoginDTO {

    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsNotEmpty()
    @IsStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minSymbols: 1,
        minNumbers: 1,
        minUppercase: 1
    })
    password: string
}