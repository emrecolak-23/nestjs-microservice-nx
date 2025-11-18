import { Controller, UseGuards } from '@nestjs/common';
import { Observable } from 'rxjs';
import {
  AuthenticateRequest,
  AuthServiceController,
  AuthServiceControllerMethods,
  User,
} from 'types/proto/auth';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UsersService } from '../users/users.service';
import { TokenPayload } from './interfaces/token-payload.interface';

@Controller()
@AuthServiceControllerMethods()
export class AuthController implements AuthServiceController {
  constructor(private readonly usersService: UsersService) {}

  // Implement gRPC methods here

  @UseGuards(JwtAuthGuard)
  authenticate(
    _request: AuthenticateRequest & { user: TokenPayload }
  ): Promise<User> | Observable<User> | User {
    console.log('Authenticate called with request:', _request);
    return this.usersService.getUser({ id: _request.user.userId });
  }
}
