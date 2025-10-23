import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, createCategoryDto: CreateCategoryDto) {
    const category = await this.prisma.category.create({
      data: {
        user_id: userId,
        name: createCategoryDto.name,
        icon: createCategoryDto.icon,
        type: createCategoryDto.type,
      },
    });
    return { category };
  }

  async findAll() {
    const categories = await this.prisma.category.findMany();
    return { categories };
  }

  async findAllByUser(userId: string) {
    const categories = await this.prisma.category.findMany({
      where: { user_id: userId, active: true },
    });
    return { categories };
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    return { category };
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
    });
    return { category };
  }

  async remove(id: string) {
    await this.prisma.category.delete({ where: { id } });
    return { message: 'Category deleted successfully' };
  }
}
