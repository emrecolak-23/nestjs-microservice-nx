import { Job } from '../../decorators/job.decorator';
import { Jobs } from '@jobber/nestjs';
import { AbstractJob } from '../abstract.job';
import { LoadProductsMessage } from '@jobber/pulsar';
import { PulsarClient } from '@jobber/pulsar';
import { PrismaService } from '../../prisma/prisma.service';

@Job({
  name: Jobs.LOAD_PRODUCTS,
  description: 'Loads uploaded products into the system',
})
export class LoadProductsJob extends AbstractJob<LoadProductsMessage> {
  protected messageClass = LoadProductsMessage;

  constructor(pulsarClient: PulsarClient, prismaService: PrismaService) {
    super(pulsarClient, prismaService);
  }
}
