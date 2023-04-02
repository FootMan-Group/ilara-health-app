import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CustomersModule } from './customers/customers.module';
import { ProductsModule } from './products/products.module';
import { ServicesModule } from './services/services.module';
import { TransactionsModule } from './transactions/transactions.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule, AuthModule, CustomersModule, ProductsModule, ServicesModule, TransactionsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
