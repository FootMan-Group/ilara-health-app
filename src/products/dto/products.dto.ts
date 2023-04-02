import { IsBoolean, IsNotEmpty, IsString, IsInt } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  product: string;

  @IsBoolean()
  @IsNotEmpty()
  status: boolean;

  @IsInt()
  @IsNotEmpty()
  stock_count: number;

  @IsInt()
  @IsNotEmpty()
  price: number;
}
