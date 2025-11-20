import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { LoggerModule } from '@jobber/nestjs';
import { GqlLoggingPlugin } from '@jobber/graphql';

@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/auth/.env',
    }),
    PrismaModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      context: ({ req, res }) => ({ req, res }),
      plugins: [
        new GqlLoggingPlugin() as unknown as import('@apollo/server').ApolloServerPlugin<any>,
      ],
      autoSchemaFile: true,
      playground: {
        settings: {
          'request.credentials': 'include',
        },
      },
      introspection: true,
    }),
    UsersModule,
    AuthModule,
  ],
  controllers: [],
})
export class AppModule {}
