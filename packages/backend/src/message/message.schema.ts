import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNumber, IsString, Length, Min } from 'class-validator';
import { Document } from 'mongoose';
import { DbObject } from '../common/db/db-object.schema';

export type MessageDocument = Message & Document;

@Schema()
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
