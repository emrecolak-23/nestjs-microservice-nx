import { Controller } from '@nestjs/common';
import { Observable } from 'rxjs';
import {
  AuthenticateRequest,
  AuthServiceController,
  AuthServiceControllerMethods,
  User,
} from 'types/proto/auth';

@Controller()
@AuthServiceControllerMethods()
export class AuthController implements AuthServiceController {
  // Implement gRPC methods here

  authenticate(
    _request: AuthenticateRequest
  ): Promise<User> | Observable<User> | User {
    return {} as User;
  }
}
