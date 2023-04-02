import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from './dto/transactions.dto';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}
  async createTransaction(dto: CreateTransactionDto) {
    // Check if service_ref matches an entry on the service_ref in the services table
    const service = await this.prisma.services.findUnique({
      where: { service_ref: dto.account_ref },
    });

    if (!service) {
      throw new ForbiddenException('Invalid Service Ref');
    }

    if (service.status) {
      throw new ForbiddenException('Service has already been dispatched');
    }

    // Call the API to reduce the service balance
    const url = `http://localhost:9000/services/${service.id}/balance`;
    const response = await fetch(url, {
      method: 'PATCH',
      body: JSON.stringify({ increment: dto.amount }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error('Failed to update service balance');
    }

    // Create a new transaction using Prisma's createTransaction method
    try {
      const transaction = await this.prisma.transactions.create({
        data: {
          customerID: { connect: { id: service.customer_id } },
          transactionTypeID: { connect: { id: dto.transaction_type_id } },
          payment_ref: dto.payment_ref,
          account_ref: dto.account_ref,
          amount: dto.amount,
          transaction_timestamp: new Date(),
          status: true,
          payer_name: dto.payer_name,
          payer_number: dto.payer_number,
          source: dto.source,
          serviceID: { connect: { id: service.id } },
        },
      });

      return transaction;
    } catch (error) {
      return error;
    }
  }

  async GetAllTransactions() {
    const transactions = await this.prisma.transactions.findMany();
    return transactions;
  }

  async GetTransactionsByCustomerId(customerId: number) {
    const transactions = await this.prisma.transactions.findMany({
      where: { customer_id: customerId },
    });
    return transactions;
  }

  async GetTransactionsByServiceId(serviceId: number) {
    const transactions = await this.prisma.transactions.findMany({
      where: { service_id: serviceId },
    });
    return transactions;
  }
}
