import { Inject, Injectable, Scope, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginPayload, LoginResult } from './auth.schema';
import { UserRepository } from '../user/user.repository';
import { compareSync } from 'bcrypt';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { User } from '../user/user.schema';

@Injectable({ scope: Scope.REQUEST })
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
    @Inject(REQUEST) private request: Request,
  ) {}

  getCurrentUser() {
    const user = this.request.user as User;

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }

  async loginAndSignJwt({ email, password }: LoginPayload) {
    const user = await this.getUserByCredentials(email, password);

    if (!user) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user._id, email: user.email, roles: user.roles };
    const result: LoginResult = {
      access_token: this.jwtService.sign(payload),
      token_type: 'Bearer',
    };

    return result;
  }

  private async getUserByCredentials(email: string, password: string) {
    const user = await this.userRepository.getByEmail(email);

    if (user && compareSync(password, user.passwordHash)) {
      return user;
    }

    return undefined;
  }
}
