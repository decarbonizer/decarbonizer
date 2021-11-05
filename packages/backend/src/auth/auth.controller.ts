import { Controller, Post, Body, HttpStatus, HttpCode } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginPayload, LoginResult } from './auth.schema';
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
    return this.authService.login(loginPayload);
  }
}
