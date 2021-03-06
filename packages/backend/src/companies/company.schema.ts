import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';
import { Document } from 'mongoose';
import { DbObjectSchema } from '../common/db/db-object-schema.decorator';
import { DbObject } from '../common/db/db-object.schema';

export type CompanyDocument = Company & Document;

@DbObjectSchema()
export class Company extends DbObject {
  @Prop()
  @ApiProperty()
  @IsString()
  @Length(1, 255)
  companyName: string;
}

export const CompanySchema = SchemaFactory.createForClass(Company);
