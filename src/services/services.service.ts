import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Services } from '.prisma/client';

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}

  async CreateService(
    customerId: number,
    productId: number,
    units: number,
    service_ref: string,
  ): Promise<Services> {
    const product = await this.prisma.products.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found.`);
    }

    if (!product.status) {
      throw new BadRequestException(
        `Product with ID ${productId} is inactive.`,
      );
    }

    const totalCost = product.price * units;

    const service = await this.prisma.services.create({
      data: {
        customerID: { connect: { id: customerId } },
        productID: { connect: { id: productId } },
        units,
        total_cost: totalCost,
        balance: -totalCost,
        service_ref: service_ref,
        status: false,
      },
    });

    return service;
  }

  async GetAllServices() {
    const services = await this.prisma.services.findMany();
    return services;
  }

  async GetServicesByStatus(status: boolean) {
    const services = await this.prisma.services.findMany({
      where: { status },
    });
    return services;
  }

  async GetServiceByCustomerId(customerId: number) {
    const services = await this.prisma.services.findMany({
      where: { customer_id: customerId },
    });
    return services;
  }

  async updateServiceBalance(
    serviceId: number,
    increment: number,
  ): Promise<Services> {
    const service = await this.prisma.services.findUnique({
      where: { id: serviceId },
      include: { productID: true },
    });

    if (!service) {
      throw new NotFoundException(`Service with ID ${serviceId} not found.`);
    }

    const updatedService = await this.prisma.services.update({
      where: { id: serviceId },
      data: {
        balance: {
          increment: increment,
        },
      },
    });

    if (updatedService.balance >= 0) {
      const finalService = await this.prisma.services.update({
        where: { id: serviceId },
        data: {
          status: true,
        },
      });

      // Call the API to reduce the product stock
      const url = `http://localhost:9000/products/${service.productID.id}/reduce-stock/${updatedService.units}`;
      const response = await fetch(url, {
        method: 'PATCH',
      });

      if (!response.ok) {
        throw new Error(
          `Failed to reduce product stock for service ${serviceId}`,
        );
      }

      return finalService;
    }

    return updatedService;
  }
}
