import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

// Create a singleton pool to avoid creating multiple connections
let globalPool: Pool | null = null;

function getPool(): Pool {
  if (!globalPool) {
    const connectionString = process.env.DATABASE_URL!;
    const url = new URL(connectionString);
    
    globalPool = new Pool({
      host: url.hostname,
      port: parseInt(url.port),
      user: url.username,
      password: decodeURIComponent(url.password),
      database: url.pathname.slice(1),
      ssl: { rejectUnauthorized: false },
      max: 20, // Maximum number of clients in the pool
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });
  }
  return globalPool;
}

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    // Initialize PrismaClient for PostgreSQL with adapter
    // Use singleton pool to avoid multiple connection pools
    const pool = getPool();
    const adapter = new PrismaPg(pool);
    
    super({
      adapter,
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
