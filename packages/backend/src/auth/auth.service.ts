import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { LoginPayload, LoginResult } from './auth.schema';

@Injectable()
export class AuthService {
  constructor(private userService: UserService, private jwtService: JwtService) {}

  async login({ email, password }: LoginPayload) {
    const user = await this.userService.getByCredentials(email, password);

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
}
