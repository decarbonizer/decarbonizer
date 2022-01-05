import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { MaxLength, IsOptional, IsString, Length, IsNumber, Min, IsUUID } from 'class-validator';
import { Document } from 'mongoose';
import { DbObjectSchema } from '../common/db/db-object-schema.decorator';
import { DbObject } from '../common/db/db-object.schema';
import { Company } from '../companies/company.schema';

export type RealEstateDocument = RealEstate & Document;

@DbObjectSchema()
export class RealEstate extends DbObject {
  @Prop()
  @ApiProperty()
  @IsString()
  @Length(1, 255)
  cityName: string;

  @Prop({ ref: Company.name })
  @ApiProperty()
  @IsUUID('4')
  companyId: string;

  @Prop()
  @ApiProperty()
  @IsOptional()
  @IsString()
  @MaxLength(10_000)
  description?: string;

  @Prop()
  @ApiProperty()
  @IsNumber()
  @Min(1)
  employees: number;

  @Prop()
  @ApiProperty()
  @IsNumber()
  @Min(1)
  area: number;

  @Prop()
  @ApiProperty()
  @IsOptional()
  @IsString()
  image?: string;
}

export const RealEstateSchema = SchemaFactory.createForClass(RealEstate);

export class RealEstateCreate extends OmitType(RealEstate, ['createdAt', 'updatedAt']) {}
export class RealEstateUpdate extends OmitType(RealEstate, ['createdAt', 'updatedAt']) {}
