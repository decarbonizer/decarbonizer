import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageDocument } from './message';

@Injectable()
export class MessageService {
  constructor(@InjectModel(Message.name) private messageModel: Model<MessageDocument>) {}

  async getOrCreateMessage() {
    let message = await this.messageModel.findOne();

    if (!message) {
      const newMessage = new this.messageModel({ content: 'Hello world!' });
      message = await newMessage.save();
    }

    return message.content;
  }
}
