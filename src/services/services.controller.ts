import { Controller, Get, Param, Post, Body, Patch } from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto';
import { Services } from '.prisma/client';

@Controller('services')
export class ServicesController {
  constructor(private servicesService: ServicesService) {}
  @Get('/all')
  async getAllServices() {
    return await this.servicesService.GetAllServices();
  }

  @Get('/all/:status')
  async getServicesByStatus(@Param('status') status: string) {
    const isActive = status === 'active';
    return await this.servicesService.GetServicesByStatus(isActive);
  }

  @Get('/customer/:customerId')
  async GetServiceByCustomerId(@Param('customerId') customerId: string) {
    return await this.servicesService.GetServiceByCustomerId(
      parseInt(customerId),
    );
  }

  @Post()
  async createService(@Body() dto: CreateServiceDto): Promise<Services> {
    const { customerId, productId, units, service_ref } = dto;
    return await this.servicesService.CreateService(
      customerId,
      productId,
      units,
      service_ref,
    );
  }

  @Patch('/:id/balance')
  async updateServiceBalance(
    @Param('id') serviceId: string,
    @Body('increment') increment: number,
  ): Promise<Services> {
    return this.servicesService.updateServiceBalance(
      parseInt(serviceId),
      increment,
    );
  }
}
