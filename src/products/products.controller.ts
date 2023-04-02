import { Controller, Get, Post, Patch, Body, Param } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto';
import { Products } from '.prisma/client';

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
  async create(@Body() dto: CreateProductDto) {
    return await this.productsService.CreateProduct(dto);
  }

  @Patch(':id/deactivate')
  async deactivateProduct(@Param('id') id: string) {
    return await this.productsService.DeactivateProduct(parseInt(id));
  }

  @Patch(':id/activate')
  async activateProduct(@Param('id') id: string) {
    return await this.productsService.ActivateProduct(parseInt(id));
  }

  @Patch(':id/increase-stock/:amount')
  async increaseProductStock(
    @Param('id') id: string,
    @Param('amount') amount: string,
  ): Promise<Products> {
    const updatedProduct = await this.productsService.IncreaseProductStock(
      Number(id),
      Number(amount),
    );
    return updatedProduct;
  }

  @Patch(':id/reduce-stock/:amount')
  async reduceProductStock(
    @Param('id') id: string,
    @Param('amount') amount: string,
  ): Promise<Products> {
    const updatedProduct = await this.productsService.ReduceProductStock(
      Number(id),
      Number(amount),
    );
    return updatedProduct;
  }
}
