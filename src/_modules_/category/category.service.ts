import { Category } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '_modules_/prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async find(): Promise<Category[]> {
    return this.prisma.category.findMany();
  }

  async create(name: string) {
    this.prisma.category.create({ data: { name } });
    return { message: 'success' };
  }
}
