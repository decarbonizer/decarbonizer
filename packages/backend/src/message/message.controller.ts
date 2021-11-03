import { Controller, Get } from '@nestjs/common';
import { MessageService } from './message.service';

@Controller()
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get()
  async get() {
    return await this.messageService.getOrCreateMessage();
  }
}
