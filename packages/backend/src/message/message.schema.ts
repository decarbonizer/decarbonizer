import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNumber, IsString, Length, Min } from 'class-validator';
import { Document } from 'mongoose';
import { DbObjectSchema } from '../common/db/db-object-schema.decorator';
import { DbObject } from '../common/db/db-object.schema';

export type MessageDocument = Message & Document;

@DbObjectSchema()
export class Message extends DbObject {
  @Prop()
  @ApiProperty()
  @IsString()
  @Length(3, 100)
  content: string;

  @Prop()
  @ApiProperty()
  @IsNumber({ maxDecimalPlaces: 0 })
  @Min(0)
  version: number;
}

export const MessageSchema = SchemaFactory.createForClass(Message);

export class MessageUpdate extends PartialType(Message) {}
