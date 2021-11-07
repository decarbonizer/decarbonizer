import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNumber, IsString, Length, Min } from 'class-validator';
import { Document } from 'mongoose';
import { DbObjectSchema } from '../common/db/db-object-schema.decorator';
import { DbObject } from '../common/db/db-object.schema';

export type BulbDocument = Bulb & Document;

@DbObjectSchema()
export class Bulb extends DbObject {
  @Prop()
  @ApiProperty()
  @IsString()
  @Length(1, 255)
  name: string;

  @Prop()
  @ApiProperty()
  @IsNumber()
  @Min(0)
  watt: number;

  @Prop()
  @ApiProperty()
  @IsNumber()
  @Min(0)
  productionKwh: number;

  @Prop()
  @ApiProperty()
  @IsNumber()
  @Min(0)
  costEuro: number;

  @Prop()
  @ApiProperty()
  @IsNumber()
  @Min(0)
  lifetimeHours: number;
}

export const BulbSchema = SchemaFactory.createForClass(Bulb);

export class BulbUpdate extends PartialType(Bulb) {}
