import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDate,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  ValidateNested,
} from 'class-validator';
import { Document } from 'mongoose';
import { DbObjectSchema } from '../common/db/db-object-schema.decorator';
import { DbObject } from '../common/db/db-object.schema';
import { RealEstate } from '../real-estate/real-estate.schema';
import { User } from '../user/user.schema';

export type ActionPlanDocument = ActionPlan & Document;

export class ActionAnswerValues {
  @ApiProperty()
  @IsObject()
  value: object;

  @ApiProperty({ required: false })
  @IsObject()
  @IsOptional()
  detailsValue?: object;
}

export class ActionAnswer {
  @ApiProperty()
  @IsString()
  actionId: string;

  @ApiProperty({ type: ActionAnswerValues })
  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => ActionAnswerValues)
  values: ActionAnswerValues;
}

@DbObjectSchema()
export class ActionPlan extends DbObject {
  @Prop()
  @ApiProperty()
  @IsString()
  @Length(1, 255)
  name: string;

  @Prop()
  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @Prop()
  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @Prop()
  @ApiProperty()
  @IsString()
  @Length(1, 255)
  status: string;

  @Prop({ ref: User.name })
  @ApiProperty()
  @IsUUID('4')
  userId: string;

  @Prop({ ref: RealEstate.name })
  @ApiProperty()
  @IsUUID('4')
  realEstateId: string;

  @Prop()
  @ApiProperty({ type: [ActionAnswer] })
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => ActionAnswer)
  actionAnswers: Array<ActionAnswer>;
}

export const ActionPlanSchema = SchemaFactory.createForClass(ActionPlan);

export class ActionPlanCreate extends OmitType(ActionPlan, ['createdAt', 'updatedAt', 'userId', 'realEstateId']) {}

export class ActionPlanUpdate extends OmitType(ActionPlan, ['createdAt', 'updatedAt', 'userId', 'realEstateId']) {}
