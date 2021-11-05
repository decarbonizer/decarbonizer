import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Message, MessageUpdate } from './message.schema';
import { MessageService } from './message.service';

@Controller('api/v1/message')
@ApiTags('Message')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get()
  @ApiResponse({ status: HttpStatus.OK, type: [Message] })
  async getAll() {
    return await this.messageService.getAll();
  }

  @Get(':id')
  @ApiResponse({ status: HttpStatus.OK, type: Message })
  @ApiResponse({ status: HttpStatus.NOT_FOUND })
  async get(@Param('id', ParseUUIDPipe) id: string) {
    return await this.messageService.get(id);
  }

  @Post()
  @ApiResponse({ status: HttpStatus.CREATED, type: Message })
  async create(@Body() body: Message) {
    return await this.messageService.create(body);
  }

  @Patch(':id')
  @ApiResponse({ status: HttpStatus.OK, type: Message })
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() body: MessageUpdate) {
    return await this.messageService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @ApiResponse({ status: HttpStatus.NOT_FOUND })
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    await this.messageService.delete(id);
  }
}
