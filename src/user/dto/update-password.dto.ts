import { IsStrongPassword } from "class-validator";
import { IsEqualTo } from "src/auth/dto/register.dto";

export class UpdateUserDTO {
    @IsStrongPassword()
    current_password: string

    @IsStrongPassword()
    new_password: string

    @IsStrongPassword()
    @IsEqualTo('new_password')
    confirm_new_password: string
}