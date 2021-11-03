import { Controller, Get } from '@nestjs/common';
import { MessageService } from './message.service';

@Controller('api/v1/message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get()
  async get() {
    return await this.messageService.getOrCreateMessage();
  }
}
