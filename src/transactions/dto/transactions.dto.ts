import { IsNotEmpty, IsInt, IsString, IsOptional } from 'class-validator';
export class CreateTransactionDto {
  @IsInt()
  @IsOptional()
  transaction_type_id: number;

  @IsString()
  @IsNotEmpty()
  payment_ref: string;

  @IsInt()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  payer_name: string;

  @IsString()
  @IsNotEmpty()
  payer_number: string;

  @IsString()
  @IsNotEmpty()
  account_ref: string;

  @IsString()
  @IsNotEmpty()
  source: string;
}
