import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginPayload {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  password: string;
}

export class LoginResult {
  @ApiProperty()
  access_token: string;

  @ApiProperty()
  token_type: 'Bearer';
}
