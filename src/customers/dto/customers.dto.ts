import {
  IsEmail,
  IsOptional,
  IsInt,
  IsNotEmpty,
  IsString,
  IsEnum,
} from 'class-validator';

export class CustomersDto {
  @IsString()
  @IsNotEmpty()
  identification_number: string;

  @IsString()
  @IsNotEmpty()
  customer_names: string;

  @IsString()
  @IsNotEmpty()
  msisdn: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class CustomerSigninDto {
  @IsString()
  @IsNotEmpty()
  identification_number: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class CustomerRefreshDto {
  @IsString()
  @IsNotEmpty()
  refresh: string;
}
