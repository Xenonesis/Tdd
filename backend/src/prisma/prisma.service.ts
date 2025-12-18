import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    // Prisma v7 expects a valid PrismaClientOptions object; cast to `any` to pass
    // runtime datasource URL from environment.
    super({
      // Use `adapter` to point PrismaClient at the database connection URL.
      adapter: {
        provider: 'postgres',
        url: process.env.DATABASE_URL,
      },
    } as any);
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
