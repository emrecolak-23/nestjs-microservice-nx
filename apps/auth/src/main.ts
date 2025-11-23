/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
require('module-alias/register');
import { join } from 'path';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { GrpcOptions, Transport } from '@nestjs/microservices';
import { Packages } from '@jobber/grpc';
import { init } from '@jobber/nestjs';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  await init(app);

  app.connectMicroservice<GrpcOptions>({
    transport: Transport.GRPC,
    options: {
      url: app.get(ConfigService).getOrThrow<string>('AUTH_GRPC_SERVICE_URL'),
      package: Packages.AUTH,
      protoPath: join(__dirname, '../../libs/grpc/proto/auth.proto'),
    },
  });
  app.startAllMicroservices();
}

bootstrap();
