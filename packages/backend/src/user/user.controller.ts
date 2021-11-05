import { Body, Controller, Get, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SafeUser } from './user.schema';
import { UserIdPipe } from './user-id.pipe';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User, UserCreate } from './user.schema';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: SafeUser })
  async get(@Param('id', UserIdPipe) id: string) {
    return await this.userService.getById(id);
  }

  @Post()
  @ApiResponse({ status: HttpStatus.CREATED, type: User })
  async create(@Body() body: UserCreate) {
    return await this.userService.create(body);
  }
}
