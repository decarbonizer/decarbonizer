import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Repository } from '../common/db/repository';
import { Message } from './message.schema';

@Injectable()
export class MessageRepository extends Repository<Message> {
  constructor(@InjectModel(Message.name) model: Model<Message>) {
    super(model);
  }
}
