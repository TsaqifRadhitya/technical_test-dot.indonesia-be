import { IsNumber, IsEnum } from "class-validator";

enum transaction_type_enum {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw'
}

export class CreateMutationDto {
    @IsNumber()
    amount: number

    @IsEnum(transaction_type_enum)
    transaction_type: string
}
