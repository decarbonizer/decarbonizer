import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Repository } from '../common/db/repository';
import { SurveyAnswer } from './survey-answer.schema';

@Injectable()
export class SurveyAnswerRepository extends Repository<SurveyAnswer> {
  constructor(@InjectModel(SurveyAnswer.name) model: Model<SurveyAnswer>) {
    super(model);
  }
}
