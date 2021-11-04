import { Injectable } from '@nestjs/common';
import { GenericCrudService } from '../common';
import { MessageRepository } from './message.repository';
import { Message, MessagePut } from './message.schema';

@Injectable()
export class MessageService extends GenericCrudService<Message, Message, MessagePut, MessageRepository> {
  constructor(messageRepository: MessageRepository) {
    super(messageRepository);
  }

  protected mapCreateToEntity(entity: Message): Message {
    return entity;
  }

  protected mapUpdateToEntity(entity: MessagePut): Partial<Message> {
    return entity;
  }
}
