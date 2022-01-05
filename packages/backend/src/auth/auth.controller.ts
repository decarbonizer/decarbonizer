import { Controller, Post, Body, HttpStatus, HttpCode } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginPayload, LoginResult, RegisterPayload } from './auth.schema';
import { AuthService } from './auth.service';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, type: LoginResult })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Invalid username or password.' })
  async login(@Body() loginPayload: LoginPayload) {
    return this.authService.loginAndSignJwt(loginPayload);
  }

  @Post('register')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, type: LoginResult })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'A user with this email already exists.' })
  async register(@Body() registerPayload: RegisterPayload) {
    return this.authService.registerUser(registerPayload);
  }
}
