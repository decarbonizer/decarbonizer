import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsObject, IsUUID } from 'class-validator';
import { Document } from 'mongoose';
import { DbObjectSchema } from '../common/db/db-object-schema.decorator';
import { DbObject } from '../common/db/db-object.schema';
import { RealEstate } from '../real-estate/real-estate.schema';
import { Survey } from '../survey/survey.schema';
import { User } from '../user/user.schema';

export type SurveyAnswerDocument = SurveyAnswer & Document;

@DbObjectSchema()
export class SurveyAnswer extends DbObject {
  @Prop({ ref: User.name })
  @ApiProperty()
  @IsUUID('4')
  userId: string;

  @Prop({ ref: Survey.name })
  @ApiProperty()
  @IsUUID('4')
  surveyId: string;

  @Prop({ ref: RealEstate.name })
  @ApiProperty()
  @IsUUID('4')
  realEstateId: string;

  @Prop({ type: Object })
  @ApiProperty()
  @IsObject()
  value: object;
}

export const SurveyAnswerSchema = SchemaFactory.createForClass(SurveyAnswer);

export class SurveyAnswerCreate extends OmitType(SurveyAnswer, [
  'createdAt',
  'updatedAt',
  'userId',
  'surveyId',
  'realEstateId',
]) {}

export class SurveyAnswerUpdate extends OmitType(SurveyAnswer, [
  'createdAt',
  'updatedAt',
  'userId',
  'surveyId',
  'realEstateId',
]) {}
