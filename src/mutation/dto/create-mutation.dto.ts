import { IsNumber, IsIn, IsString } from 'class-validator';

export class CreateMutationDto {
  @IsNumber()
  amount: number;

  @IsString()
  @IsIn(['deposit', 'withdraw'])
  transaction_type: string;
}
