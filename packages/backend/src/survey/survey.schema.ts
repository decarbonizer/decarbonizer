import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsOptional, IsString, IsUrl, Length } from 'class-validator';
import { Document } from 'mongoose';
import { DbObjectSchema } from '../common/db/db-object-schema.decorator';
import { DbObject } from '../common/db/db-object.schema';

export type SurveyDocument = Survey & Document;

@DbObjectSchema()
export class Survey extends DbObject {
  @Prop()
  @ApiProperty()
  @IsString()
  @Length(1, 255)
  identifier: string;

  @Prop()
  @ApiProperty()
  @IsString()
  @Length(1, 255)
  name: string;

  @Prop()
  @ApiProperty()
  @IsString()
  @IsUrl()
  imageUrl: string;

  @Prop()
  @ApiProperty()
  @IsOptional()
  @IsString()
  @Length(0, 5000)
  description?: string;

  @Prop({ type: Object })
  @ApiProperty()
  @IsObject()
  schema: object;
}

export const SurveySchema = SchemaFactory.createForClass(Survey);
