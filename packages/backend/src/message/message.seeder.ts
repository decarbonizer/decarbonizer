import { Injectable } from '@nestjs/common';
import { DefaultDbSeeder } from '../debug/db.seeder';
import { MessageRepository } from './message.repository';
import { Message } from './message.schema';

@Injectable()
export class MessageSeeder extends DefaultDbSeeder<Message> {
  constructor(messageRepository: MessageRepository) {
    super(messageRepository);
  }

  protected override getSeed(): Array<Message> {
    return [{ _id: '00000000-0000-0000-0000-000000000000', content: 'Hello World!', version: 1 }];
  }
}
