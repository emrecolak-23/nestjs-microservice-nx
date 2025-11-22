import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JobsModule } from './jobs.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { LoggerModule } from '@jobber/nestjs';
import { GqlLoggingPlugin } from '@jobber/graphql';
import { UploadsModule } from './uploads/uploads.module';

@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JobsModule,
    UploadsModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      plugins: [
        new GqlLoggingPlugin() as unknown as import('@apollo/server').ApolloServerPlugin<any>,
      ],
      playground: {
        settings: {
          'request.credentials': 'include',
        },
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
