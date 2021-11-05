import { Injectable } from '@nestjs/common';
import { GenericCrudService } from '../common/services/generic-crud.service';
import { MessageRepository } from './message.repository';
import { Message, MessageUpdate } from './message.schema';

@Injectable()
export class MessageService extends GenericCrudService<Message, Message, MessageUpdate, MessageRepository> {
  constructor(messageRepository: MessageRepository) {
    super(messageRepository);
  }

  protected mapCreateToEntity(entity: Message): Message {
    return entity;
  }

  protected mapUpdateToEntity(entity: MessageUpdate): Partial<Message> {
    return entity;
  }
}
