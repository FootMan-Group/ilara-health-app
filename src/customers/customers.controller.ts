import { Controller, Post, Body, Req, Get, Query, Param } from '@nestjs/common';
import { CustomersService } from './customers.service';

import { CustomerRefreshDto, CustomersDto, CustomerSigninDto } from './dto';

import { Request } from 'express';


@Controller('customers')
export class CustomersController {
  constructor(private customerService: CustomersService) {}

  //Customer create end point
  @Post('create')
  CreateCustomer(@Body() dto: CustomersDto, @Req() req: Request) {
    return this.customerService.CreateCustomer(dto);
  }

  //Get all customer lists
  @Get('all')
  async GetAllCustomers(
    @Query('page') page = 1,
    @Query('perPage') perPage = 10,
  ) {
    const customers = await this.customerService.GetAllCustomers(page, perPage);
    const totalCustomers = await this.customerService.GetTotalCustomers();
    const totalPages = Math.ceil(totalCustomers / perPage);

    return {
      page,
      perPage,
      totalPages,
      totalCustomers,
      data: customers,
    };
  }

  @Get(':id')
  async GetCustomerById(@Param('id') id: string) {
    const customer = await this.customerService.GetCustomerById(Number(id));
    return customer;
  }

  @Post('/auth/signin')
  SignIn(@Body() dto: CustomerSigninDto) {
    return this.customerService.signin(dto);
  }

  @Post('auth/refresh')
  RefreshToken(@Body() dto: CustomerRefreshDto) {
    return this.customerService.refreshToken(dto);
  }
}
