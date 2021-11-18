import { Injectable } from '@nestjs/common';
import { DefaultDbSeeder } from '../debug/db.seeder';
import { SurveyAnswerRepository } from './survey-answer.repository';
import { SurveyAnswer } from './survey-answer.schema';

@Injectable()
export class SurveyAnswerSeeder extends DefaultDbSeeder<SurveyAnswer> {
  constructor(surveyAnswerRepository: SurveyAnswerRepository) {
    super(surveyAnswerRepository);
  }

  protected override getSeed(): Array<SurveyAnswer> {
    return [
      {
        _id: '00000000-0000-0000-0000-000000000000',
        realEstateId: '00000000-0000-0000-0000-000000000000',
        surveyId: '00000000-0000-0000-0000-000000000000',
        value: {
          foo: 123,
        },
      },
    ];
  }
}
