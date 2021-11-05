import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { User, UserCreate } from './user.schema';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiResponse({ status: HttpStatus.CREATED, type: User })
  async create(@Body() body: UserCreate) {
    return await this.userService.create(body);
  }
}
