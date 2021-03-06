import { Prop } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsOptional } from 'class-validator';
import { v4 } from 'uuid';
import { DbObjectSchema } from './db-object-schema.decorator';

@DbObjectSchema()
export class DbObject {
  @Prop({
    type: String,
    default: () => v4(),
  })
  @ApiProperty()
  @IsOptional()
  _id?: string;

  @Prop()
  @ApiProperty()
  @IsDate()
  createdAt?: Date;

  @Prop()
  @ApiProperty()
  @IsDate()
  updatedAt?: Date;
}

export type WithId<T extends DbObject> = T & { _id: string };
