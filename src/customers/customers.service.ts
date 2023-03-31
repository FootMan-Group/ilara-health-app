import {
  Injectable,
  ForbiddenException,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';
import { CustomersDto, CustomerSigninDto, CustomerRefreshDto } from './dto';
import { Customers } from '@prisma/client';
import * as argon from 'argon2';
import * as jwtoken from 'jsonwebtoken';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class CustomersService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private jwt: JwtService,
  ) {}

  async CreateCustomer(dto: CustomersDto) {
    try {
      const hashPassword = await argon.hash(dto.password);
      //save the new customerto the DB
      const customer = await this.prisma.customers.create({
        data: {
          msisdn: dto.msisdn,
          identification_number: dto.identification_number,
          email: dto.email,
          customer_names: dto.customer_names,
          password: hashPassword,
        },
      });

      delete customer.password;

      return customer;
    } catch (error) {
      return error;
    }
  }

  async GetCustomerById(id: number) {
    const customer = await this.prisma.customers.findUnique({
      where: { id },
    });

    delete customer.password;
    return customer;
  }

  async GetAllCustomers(page: number, limit: number): Promise<Customers[]> {
    const offset = (page - 1) * limit;
    return await this.prisma.customers.findMany({
      skip: offset,
      take: limit,
    });
  }

  async GetTotalCustomers(): Promise<number> {
    const totalCustomers = await this.prisma.customers.count();
    return totalCustomers;
  }

  async signin(dto: CustomerSigninDto) {
    //find the customer by ID
    const customer = await this.prisma.customers.findUnique({
      where: {
        identification_number: dto.identification_number,
      },
    });

    //If the customer does not exist throw an exceptions
    if (!customer) {
      throw new ForbiddenException('Customer does not exist');
    }
    //Confirm the password
    const passwordMatch = await argon.verify(customer.password, dto.password);

    //If the password is wrong throw an exceptions
    if (!passwordMatch) {
      throw new ForbiddenException('Password does not match');
    }

    //else return a JWT with access and refresh token
    return this.JwtSignToken(
      customer.id,
      customer.identification_number,
      customer.customer_names,
      customer.msisdn,
      customer.email,
    );

    //delete the otp
  }

  async JwtSignToken(
    customerId: number,
    identification_number: string,
    customer_names: string,
    msisdn: string,
    email: string,
  ): Promise<{ access: string, refresh: string, }> {
    //this will receive the id and id number
    const payload = {
      customerId,
      identification_number,
      customer_names,
      msisdn,
      email,
      type: 'access',
    };
    //This will then transform the 2 to JWT
    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '16000m',
      secret: secret,
    });

    // Generate refresh token
    const refreshTokenPayload = {
      customerId,
      type: 'refresh',
    };

    // This will transform the payload into a JWT refresh token
    const refreshSecret = this.config.get('JWT_REFRESH_SECRET');
    const refreshToken = await this.jwt.signAsync(refreshTokenPayload, {
      expiresIn: '1d',
      secret: refreshSecret,
    });

    // Store the refresh token in the database for the customer
    await this.prisma.customers.update({
      where: {
        id: customerId,
      },
      data: {
        refresh_token: refreshToken,
      },
    });

    return {
      access: token,
      refresh: refreshToken,
    };
  }

  async refreshToken(
    dto: CustomerRefreshDto,
  ): Promise<{ access: string; refresh: string }> {
    try {
      // Verify the refresh token and extract the customer ID
      const decoded: any = jwtoken.verify(
        dto.refresh,
        this.config.get('JWT_REFRESH_SECRET'),
      );

      const customerId = decoded.customerId;

      // Check if the customer exists in the database
      const customer = await this.prisma.customers.findUnique({
        where: {
          id: customerId,
        },
      });
      if (!customer) {
        throw new ForbiddenException('customer does not exist');
      }

      // Check if the customer's refresh token matches the one provided
      if (customer.refresh_token !== dto.refresh) {
        throw new ForbiddenException('Invalid refresh token');
      }

      // Generate a new access token
      const accessPayload = {
        customerId: customer.id,
        identification_number: customer.identification_number,
        customer_names: customer.customer_names,
        msisdn: customer.msisdn,
        email: customer.email,
        type: 'access',
      };
      const accessSecret = this.config.get('JWT_SECRET');
      const accessToken = await this.jwt.signAsync(accessPayload, {
        expiresIn: '1600m',
        secret: accessSecret,
      });

      // Generate a new refresh token
      const refreshPayload = {
        customerId: customer.id,
        type: 'refresh',
      };
      const refreshSecret = this.config.get('JWT_REFRESH_SECRET');
      const newRefreshToken = await this.jwt.signAsync(refreshPayload, {
        expiresIn: '1d',
        secret: refreshSecret,
      });

      // Update the customer's refresh token in the database
      await this.prisma.customers.update({
        where: { id: customer.id },
        data: { refresh_token: newRefreshToken },
      });

      // Return the new access token and refresh token
      return { access: accessToken, refresh: newRefreshToken };
    } catch (error) {
      if (error instanceof jwtoken.TokenExpiredError) {
        throw new UnauthorizedException('Refresh token has expired');
      } else if (error instanceof jwtoken.JsonWebTokenError) {
        throw new UnauthorizedException('Invalid refresh token');
      } else {
        throw error;
      }
    }
  }
}
