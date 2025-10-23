import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  extendedPrismaClient() {
    return this.$extends(withAccelerate());
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
