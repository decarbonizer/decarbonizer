import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Repository } from '../common/db/repository';
import { Survey } from './survey.schema';

@Injectable()
export class SurveyRepository extends Repository<Survey> {
  constructor(@InjectModel(Survey.name) model: Model<Survey>) {
    super(model);
  }
}
