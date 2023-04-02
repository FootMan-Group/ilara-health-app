import { Injectable, ForbiddenException, Req } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';
//import { CreateProductDto } from './dto';

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

  async CreateProduct(product: string, status: boolean) {
    const newProduct = await this.prisma.products.create({
      data: { product: product, status: status },
    });
    return newProduct;
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
}
