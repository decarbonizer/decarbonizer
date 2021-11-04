import { Prop, Schema } from '@nestjs/mongoose';
import { IsOptional, IsUUID } from 'class-validator';
import { v4 } from 'uuid';

@Schema()
export class DbObject {
  @Prop({
    type: String,
    default: () => v4(),
  })
  @IsUUID('4')
  @IsOptional()
  _id?: string;
}
