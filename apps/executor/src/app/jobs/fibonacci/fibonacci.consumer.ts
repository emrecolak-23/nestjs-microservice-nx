import { Injectable, OnModuleInit } from '@nestjs/common';
import { PulsarClient, PulsarConsumer } from '@jobber/pulsar';
import { iterate } from 'fibonacci';
import { FibonacciMessage } from '@jobber/pulsar';
import { Jobs } from '@jobber/nestjs';

@Injectable()
export class FibonacciConsumer
  extends PulsarConsumer<FibonacciMessage>
  implements OnModuleInit
{
  constructor(pulsarClient: PulsarClient) {
    super(pulsarClient, Jobs.FIBONACCI);
  }

  protected async onMessage(data: FibonacciMessage): Promise<void> {
    const result = iterate(data.iterations);
    this.logger.log(
      `Fibonacci result for ${data.iterations} iterations: ${result}`
    );
  }
}
