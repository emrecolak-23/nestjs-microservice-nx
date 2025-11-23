import { Controller, UseInterceptors } from '@nestjs/common';
import {
  GrpcLoggingInterceptor,
  ProductsServiceControllerMethods,
  ProductsServiceController,
  CreateProductRequest,
  CreateProductResponse,
} from '@jobber/grpc';
import { ProductsService } from './products.service';

@Controller()
@ProductsServiceControllerMethods()
@UseInterceptors(GrpcLoggingInterceptor)
export class ProductsController implements ProductsServiceController {
  constructor(private readonly productsService: ProductsService) {}

  createProduct(request: CreateProductRequest) {
    return this.productsService.createProduct(request);
  }
}
