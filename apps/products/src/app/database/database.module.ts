import { Global, Module } from '@nestjs/common';
import { DATABASE_CONNECTION } from './database.connection';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as productSchema from '../products/schema';
import * as categorySchema from '../categories/schema';

@Global()
@Module({
  providers: [
    {
      provide: DATABASE_CONNECTION,
      useFactory: async (configService: ConfigService) => {
        const pool = new Pool({
          connectionString: configService.getOrThrow<string>('DATABASE_URL'),
        });

        return drizzle(pool, {
          schema: {
            ...productSchema,
            ...categorySchema,
          },
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [DATABASE_CONNECTION],
})
export class DatabaseModule {}
