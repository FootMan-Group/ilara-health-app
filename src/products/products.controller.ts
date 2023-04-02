import { Controller, Get, Post, Patch, Body, Param } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  async getAllProducts() {
    return await this.productsService.GetAllProducts();
  }

  @Get(':status')
  async getProductsByStatus(@Param('status') status: string) {
    const isActive = status === 'active';
    return await this.productsService.GetFilteredProducts(isActive);
  }

  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    const { product, status } = createProductDto;
    return await this.productsService.CreateProduct(product, status);
  }

  @Patch(':id/deactivate')
  async deactivateProduct(@Param('id') id: string) {
    return await this.productsService.DeactivateProduct(parseInt(id));
  }

  @Patch(':id/activate')
  async activateProduct(@Param('id') id: string) {
    return await this.productsService.ActivateProduct(parseInt(id));
  }
}
