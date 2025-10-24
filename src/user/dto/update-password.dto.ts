import { isNotEmpty, IsStrongPassword } from "class-validator";
import { IsEqualTo } from "../../decorators/is-equals-to.decorator";
import { IsDifferentTo } from "../../decorators/is-different-to.decorator";

export class UpdatePasswordDTO {
    @IsStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minSymbols: 1,
        minNumbers: 1,
        minUppercase: 1
    })
    current_password: string

    @IsStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minSymbols: 1,
        minNumbers: 1,
        minUppercase: 1
    })
    @IsDifferentTo("current_password")
    new_password: string

    @IsStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minSymbols: 1,
        minNumbers: 1,
        minUppercase: 1
    })
    
    @IsEqualTo('new_password')
    confirm_new_password: string
}