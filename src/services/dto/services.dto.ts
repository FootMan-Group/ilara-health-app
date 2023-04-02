import { IsNotEmpty, IsInt, IsString } from 'class-validator';

export class CreateServiceDto {
  @IsInt()
  @IsNotEmpty()
  customerId: number;

  @IsInt()
  @IsNotEmpty()
  productId: number;

  @IsInt()
  @IsNotEmpty()
  units: number;

  @IsString()
  @IsNotEmpty()
  service_ref: string;
}
