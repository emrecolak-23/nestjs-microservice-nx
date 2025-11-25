import { config } from 'dotenv';
import { resolve } from 'path';
import type { PrismaConfig } from 'prisma';
import { env } from 'prisma/config';

config({ path: resolve(__dirname, '../.env') });

export default {
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
} satisfies PrismaConfig;
