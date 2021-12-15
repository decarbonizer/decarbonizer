import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Length, Min } from 'class-validator';
import { Document } from 'mongoose';
import { DbObjectSchema } from '../common/db/db-object-schema.decorator';
import { DbObject } from '../common/db/db-object.schema';

export type HeatingTypeDocument = HeatingType & Document;

@DbObjectSchema()
export class HeatingType extends DbObject {
  @Prop()
  @ApiProperty()
  @IsString()
  @Length(1, 255)
  name: string;

  @Prop()
  @ApiProperty()
  @IsString()
  @Length(1, 255)
  energyForm: string;

  @Prop()
  @ApiProperty()
  @IsNumber()
  @Min(0)
  installationCostInEuro: number;

  @Prop()
  @ApiProperty()
  @IsNumber()
  @Min(0)
  productionKwh: number;

  @Prop()
  @ApiProperty()
  @IsNumber()
  @Min(0)
  consumptionKwh: number;
}

export const HeatingTypeSchema = SchemaFactory.createForClass(HeatingType);
