import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginInput } from './dto/login.input';
import { Response } from 'express';
import { UsersService } from '../users/users.service';
import { compare } from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from './interfaces/token-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService
  ) {}

  async login({ email, password }: LoginInput, res: Response) {
    const user = await this.verifyUser(email, password);
    const expires = new Date();
    expires.setMilliseconds(
      expires.getTime() +
        parseInt(this.configService.getOrThrow<string>('JWT_EXPIRATION_MS'))
    );
    const payload: TokenPayload = {
      userId: user.id,
    };

    const accessToken = this.jwtService.sign(payload);
    res.cookie('authentication', accessToken, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      expires,
    });

    return user;
  }

  private async verifyUser(email: string, password: string) {
    try {
      const existingUser = await this.usersService.getUser({ email });
      const authenticated = await compare(password, existingUser.password);
      if (!authenticated) {
        throw new UnauthorizedException();
      }
      return existingUser;
    } catch (err) {
      throw new UnauthorizedException('Credential are not valid');
    }
  }
}
