import { ForbiddenException, forwardRef, Inject, Injectable, Scope, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginPayload, LoginResult, RegisterPayload } from './auth.schema';
import { UserRepository } from '../user/user.repository';
import { compareSync } from 'bcrypt';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { User } from '../user/user.schema';
import { WithId } from '../common/db/db-object.schema';
import { UserService } from '../user/user.service';

/**
 * A service which provides functions in the area of user authentication and management.
 */
@Injectable({ scope: Scope.REQUEST })
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    @Inject(forwardRef(() => UserService)) private userService: UserService,
    private jwtService: JwtService,
    @Inject(REQUEST) private request: Request,
  ) {}

  /**
   * Returns the user which is currently signed in.
   * @returns The signed-in user.
   */
  getCurrentUser(): WithId<User> {
    const user = this.request.user as User;

    if (!user) {
      throw new UnauthorizedException();
    }

    return user as WithId<User>;
  }

  getCurrentUserId() {
    const user = this.getCurrentUser();
    return user._id;
  }

  /**
   * Attempts to sign-in a user using the given credentials.
   * If successful, issues a JWT which can be used to access protected endpoints.
   */
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

  /**
   * Attempts to create a user using the given credentials.
   * If successful, issues a JWT which can be used to access protected endpoints.
   */
  async registerUser({ email, password, companyId }: RegisterPayload) {
    const existingUser = await this.userRepository.getByEmail(email);

    if (existingUser) {
      throw new ForbiddenException();
    }

    const newUser = await this.userService.create({ email, password, companyId });

    const payload = { sub: newUser._id, email: newUser.email, roles: newUser.roles };

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
