import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/transactions.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get('/all')
  getAllTransactions() {
    return this.transactionsService.GetAllTransactions();
  }

  @Get('customer/:customerId')
  getTransactionsByCustomerId(@Param('customerId') customerId: string) {
    return this.transactionsService.GetTransactionsByCustomerId(
      parseInt(customerId),
    );
  }

  @Get('service/:serviceId')
  getTransactionsByServiceId(@Param('serviceId') serviceId: string) {
    return this.transactionsService.GetTransactionsByServiceId(
      parseInt(serviceId),
    );
  }

  @Post()
  async createTransaction(@Body() dto: CreateTransactionDto) {
    const transaction = await this.transactionsService.createTransaction(dto);
    return transaction;
  }
}
