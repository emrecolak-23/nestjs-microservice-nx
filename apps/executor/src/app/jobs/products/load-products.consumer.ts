import {
  Packages,
  PRODUCTS_SERVICE_NAME,
  ProductsServiceClient,
} from '@jobber/grpc';
import { Jobs } from '@jobber/nestjs';
import {
  LoadProductsMessage,
  PulsarClient,
  PulsarConsumer,
} from '@jobber/pulsar';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { JobConsumer } from '../job.consumer';

@Injectable()
export class LoadProductsConsumer
  extends JobConsumer<LoadProductsMessage>
  implements OnModuleInit
{
  private produtsService: ProductsServiceClient;

  constructor(
    pulsarClient: PulsarClient,
    @Inject(Packages.JOBS) clientJobs: ClientGrpc,
    @Inject(Packages.PRODUCTS) private clientProducts: ClientGrpc
  ) {
    super(Jobs.LOAD_PRODUCTS, pulsarClient, clientJobs);
  }

  async onModuleInit(): Promise<void> {
    this.produtsService = this.clientProducts.getService<ProductsServiceClient>(
      PRODUCTS_SERVICE_NAME
    );
    await super.onModuleInit();
  }

  protected async execute(data: LoadProductsMessage): Promise<void> {
    await firstValueFrom(this.produtsService.createProduct(data));
  }
}
