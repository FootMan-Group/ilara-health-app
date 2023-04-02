import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  product: string;

  @IsBoolean()
  @IsNotEmpty()
  status: boolean;
}
