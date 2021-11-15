import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Length, Min } from 'class-validator';
import { Document } from 'mongoose';
import { DbObjectSchema } from '../common/db/db-object-schema.decorator';
import { DbObject } from '../common/db/db-object.schema';

export type EnergyFormDocument = EnergyForm & Document;

@DbObjectSchema()
export class EnergyForm extends DbObject {
  @Prop()
  @ApiProperty()
  @IsString()
  @Length(1, 255)
  name: string;

  @Prop()
  @ApiProperty()
  @IsNumber()
  @Min(0)
  co2PerGramPerKwh: number;

  @Prop()
  @ApiProperty()
  @IsNumber()
  @Min(0)
  euroPerKwh: number;
}

export const EnergyFormSchema = SchemaFactory.createForClass(EnergyForm);
