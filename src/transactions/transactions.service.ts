import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, createTransactionDto: CreateTransactionDto) {
    const transaction = await this.prisma.transaction.create({
      data: {
        user_id: userId,
        amount: createTransactionDto.amount,
        type: createTransactionDto.type,
        category_id: createTransactionDto.category_id,
        date: createTransactionDto.date,
        description: createTransactionDto.description,
        payment_method: createTransactionDto.payment_method,
      },
    });
    return { transaction };
  }

  async findAll() {
    const transactions = await this.prisma.transaction.findMany();
    return { transactions };
  }

  async findAllByUser(userId: string) {
    const transactions = await this.prisma.transaction.findMany({
      where: { user_id: userId, active: true },
    });
    return { transactions };
  }

  async findOne(id: string) {
    const transaction = await this.prisma.transaction.findUnique({ where: { id } });
    return { transaction };
  }

  async update(id: string, updateTransactionDto: UpdateTransactionDto) {
    const transaction = await this.prisma.transaction.update({
      where: { id },
      data: updateTransactionDto,
    });
    return { transaction };
  }

  async remove(id: string) {
    await this.prisma.transaction.delete({ where: { id } });
    return { message: 'Transaction deleted successfully' };
  }
}
