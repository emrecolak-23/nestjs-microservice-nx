require('module-alias/register');
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { init } from '@jobber/nestjs';
import { GrpcOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { Packages } from '@jobber/grpc';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  await init(app);

  app.connectMicroservice<GrpcOptions>({
    transport: Transport.GRPC,
    options: {
      url: app
        .get(ConfigService)
        .getOrThrow<string>('PRODUCTS_GRPC_SERVICE_URL'),
      package: Packages.PRODUCTS,
      protoPath: join(__dirname, '../../libs/grpc/proto/products.proto'),
    },
  });
  app.startAllMicroservices();
}

bootstrap();
