import { Module } from '@nestjs/common';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    ConfigModule,
    PinoLoggerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const isProduction = configService.get('NODE_ENV') === 'production';

        return {
          pinoHttp: {
            level: isProduction ? 'info' : 'debug',
            transport: !isProduction
              ? {
                  target: 'pino-pretty',
                  options: {
                    colorize: true,
                    singleLine: true,
                  },
                }
              : undefined,
          },
        } as any;
      },
      inject: [ConfigService],
    }),
  ],
})
export class LoggerModule {}
