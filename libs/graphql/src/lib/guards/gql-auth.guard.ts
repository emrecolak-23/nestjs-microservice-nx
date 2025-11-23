import {
  CanActivate,
  ExecutionContext,
  Injectable,
  OnModuleInit,
  Inject,
  Logger,
} from '@nestjs/common';
import { catchError, map, Observable, of } from 'rxjs';
import { Packages, AuthServiceClient, AUTH_SERVICE_NAME } from '@jobber/grpc';
import { ClientGrpc } from '@nestjs/microservices';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class GqlAuthGuard implements CanActivate, OnModuleInit {
  private readonly logger = new Logger(GqlAuthGuard.name, { timestamp: true });
  private authService: AuthServiceClient;

  constructor(@Inject(Packages.AUTH) private client: ClientGrpc) {}

  onModuleInit() {
    this.authService =
      this.client.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
  }

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const token = this.getRequest(context).cookies?.authentication;
    if (!token) {
      return false;
    }

    return this.authService.authenticate({ token }).pipe(
      map((res) => {
        this.getRequest(context).user = res;
        return true;
      }),
      catchError((err) => {
        this.logger.error(err);
        return of(false);
      })
    );
  }

  private getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
}
