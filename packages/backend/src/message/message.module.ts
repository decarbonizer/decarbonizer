import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from './message';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Message.name,
        schema: MessageSchema,
      },
    ]),
  ],
  controllers: [MessageController],
  providers: [MessageService],
})
export class MessageModule {}
