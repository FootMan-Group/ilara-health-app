import { Injectable, NotFoundException, Req } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';
import { Products } from '.prisma/client';
import { CreateProductDto } from './dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService, private config: ConfigService) {}

  async GetAllProducts() {
    const products = await this.prisma.products.findMany();
    return products;
  }

  async GetFilteredProducts(status: boolean | undefined) {
    const products = await this.prisma.products.findMany({
      where: { status: status },
    });
    return products;
  }

  async CreateProduct(dto: CreateProductDto): Promise<Products> {
    const { product, status, stock_count, price } = dto;

    try {
      const newProduct = await this.prisma.products.create({
        data: { product, status, stock_count, price },
      });
      return newProduct;
    } catch (e) {
      return e;
    }
  }

  async DeactivateProduct(productId: number) {
    const updatedProduct = await this.prisma.products.update({
      where: { id: productId },
      data: { status: false },
    });
    return updatedProduct;
  }

  async ActivateProduct(productId: number) {
    const updatedProduct = await this.prisma.products.update({
      where: { id: productId },
      data: { status: true },
    });
    return updatedProduct;
  }

  async IncreaseProductStock(id: number, amount: number): Promise<Products> {
    const product = await this.prisma.products.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found.`);
    }

    const updatedProduct = await this.prisma.products.update({
      where: { id },
      data: { stock_count: product.stock_count + amount },
    });

    return updatedProduct;
  }

  async ReduceProductStock(id: number, amount: number): Promise<Products> {
    const product = await this.prisma.products.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found.`);
    }
    const updatedStockCount = Math.max(0, product.stock_count - amount);
    const updatedProduct = await this.prisma.products.update({
      where: { id },
      data: { stock_count: updatedStockCount },
    });
    return updatedProduct;
  }
}
