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

  async getAllForSurveyAndRealEstate(realEstateId: string, surveyId: string) {
    const results = await this.model.find({
      realEstateId,
      surveyId,
    });
    return results.map((doc) => doc.toObject() as SurveyAnswer);
  }

  async getAllForRealEstate(realEstateId: string) {
    const results = await this.model.find({ realEstateId });
    return results.map((doc) => doc.toObject() as SurveyAnswer);
  }
}
