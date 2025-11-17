import { Module } from '@nestjs/common';
import { FibonacciJob } from './fibonacci.jobs';
import { DiscoveryModule } from '@golevelup/nestjs-discovery';
import { JobsService } from './jobs.service';
import { JobResolver } from './jobs.resolver';

@Module({
  imports: [DiscoveryModule],
  providers: [JobsService, FibonacciJob, JobResolver],
})
export class JobsModule {}
