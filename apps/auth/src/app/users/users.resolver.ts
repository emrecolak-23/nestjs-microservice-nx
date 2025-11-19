import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { User } from './models/users.model';
import { UsersService } from './users.service';
import { CreateUserInput } from './dto/create-user.input';
import { UseGuards, Logger } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { TokenPayload } from '../auth/interfaces/token-payload.interface';

@Resolver(() => User)
export class UsersResolver {
  private readonly logger = new Logger(UsersResolver.name, { timestamp: true });

  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => User)
  async createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.usersService.createUser(createUserInput);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [User], { name: 'users' })
  async getUsers(@CurrentUser() { userId }: TokenPayload) {
    this.logger.log(`User ID: ${userId}`);
    return this.usersService.getUsers();
  }
}
