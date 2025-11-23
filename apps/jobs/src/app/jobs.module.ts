import { Module } from '@nestjs/common';
import { FibonacciJob } from './jobs/fibonacci/fibonacci.jobs';
import { DiscoveryModule } from '@golevelup/nestjs-discovery';
import { JobsService } from './jobs.service';
import { JobResolver } from './jobs.resolver';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Packages } from '@jobber/grpc';
import { join } from 'path';
import { PulsarModule } from '@jobber/pulsar';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    DiscoveryModule,
    PulsarModule,
    ClientsModule.registerAsync([
      {
        name: Packages.AUTH,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            url: configService.getOrThrow<string>('AUTH_GRPC_SERVICE_URL'),
            package: Packages.AUTH,
            protoPath: join(__dirname, '../../libs/grpc/proto/auth.proto'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [JobsService, FibonacciJob, JobResolver],
})
export class JobsModule {}
