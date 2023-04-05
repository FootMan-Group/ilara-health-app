import { Module } from '@nestjs/common';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { CustomerJwtStrategy } from './strategy';

@Module({
  imports: [PrismaModule, JwtModule.register({})],
  controllers: [CustomersController],
  providers: [CustomersService, CustomerJwtStrategy],
})
export class CustomersModule {}
