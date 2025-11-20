import { INestApplication } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';

export async function init(app: INestApplication) {
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  app.useLogger(app.get(Logger));
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    })
  );

  const port = app.get(ConfigService).getOrThrow<number>('PORT');
  await app.listen(port);
  app
    .get(Logger)
    .log(
      `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
    );
}
