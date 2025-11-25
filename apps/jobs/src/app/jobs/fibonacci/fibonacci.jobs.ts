import { PulsarClient } from '@jobber/pulsar';
import { Job } from '../../decorators/job.decorator';
import { AbstractJob } from '../abstract.job';
import { FibonacciMessage } from '@jobber/pulsar';
import { Jobs } from '@jobber/nestjs';
import { PrismaService } from '../../prisma/prisma.service';

@Job({
  name: Jobs.FIBONACCI,
  description: 'Generates Fibonacci numbers and store it in the database',
})
export class FibonacciJob extends AbstractJob<FibonacciMessage> {
  protected messageClass = FibonacciMessage;

  constructor(pulsarClient: PulsarClient, prismaService: PrismaService) {
    super(pulsarClient, prismaService);
  }
}
