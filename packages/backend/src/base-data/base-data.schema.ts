import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsUUID, IsOptional, IsNumber } from 'class-validator';
import { Document } from 'mongoose';
import { DbObjectSchema } from '../common/db/db-object-schema.decorator';
import { DbObject } from '../common/db/db-object.schema';
import { RealEstate } from '../real-estate/real-estate.schema';

export type BaseDataDocument = BaseData & Document;

@DbObjectSchema()
export class BaseData extends DbObject {
  @IsOptional()
  @Prop({ ref: RealEstate.name })
  @ApiProperty()
  @IsUUID('4')
  realEstateId: string;

  @Prop()
  @ApiProperty()
  @IsNumber()
  salaryElectricianMaintenanceWorkerPerHour: number; // €/h

  @Prop()
  @ApiProperty()
  @IsNumber()
  timeToChangeOneBulb: number; // min/Stk

  @Prop()
  @ApiProperty()
  @IsNumber()
  salaryItMaintenanceWorkerPerHour: number; // €/h

  @Prop()
  @ApiProperty()
  @IsNumber()
  reductionFactorByUsingSuperServer: number;

  @Prop()
  @ApiProperty()
  @IsNumber()
  superServerCost: number;

  @Prop()
  @ApiProperty()
  @IsNumber()
  normalServerCost: number;

  @Prop()
  @ApiProperty()
  @IsNumber()
  serverMaintenanceTime: number;

  @Prop()
  @ApiProperty()
  @IsNumber()
  serverLifeTime: number;

  @Prop()
  @ApiProperty()
  @IsNumber()
  footPrintServer: number;

  @Prop()
  @ApiProperty()
  @IsNumber()
  heatingKwHPerQm: number;

  @Prop()
  @ApiProperty()
  @IsNumber()
  shortTravelEF: number;

  @Prop()
  @ApiProperty()
  @IsNumber()
  longTravelEF: number;

  @Prop()
  @ApiProperty()
  @IsNumber()
  illuminationEF: number;
}

export const BaseDataSchema = SchemaFactory.createForClass(BaseData);

export class BaseDataUpsert extends OmitType(BaseData, ['createdAt', 'updatedAt', 'realEstateId']) {}
