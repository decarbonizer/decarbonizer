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
        surveyId: 'illumination',
        userId: '00000000-0000-0000-0000-000000000000',
        realEstateId: '00000000-0000-0000-0000-000000000000',
        value: {
          realEstateName: 'Reception',
          isInitialSurvey: true,
          lampCount: 10,
          bulbType: '00000000-0000-0000-0000-000000000000',
          isIlluminantExchangeable: true,
          switchOnMode: 'always',
        },
      },
      {
        _id: '00000000-0000-0000-0000-000000000001',
        surveyId: 'illumination',
        userId: '00000000-0000-0000-0000-000000000000',
        realEstateId: '00000000-0000-0000-0000-000000000000',
        value: {
          realEstateName: 'Conference room',
          isInitialSurvey: true,
          lampCount: 10,
          bulbType: '00000000-0000-0000-0000-000000000001',
          isIlluminantExchangeable: true,
          switchOnMode: 'manually',
          avgRuntimePerDay: 0.3333333333333333,
          avgRuntimePerYear: 200,
        },
      },
      {
        _id: '00000000-0000-0000-0000-000000000002',
        surveyId: 'illumination',
        userId: '00000000-0000-0000-0000-000000000000',
        realEstateId: '00000000-0000-0000-0000-000000000000',
        value: {
          realEstateName: 'Kitchen',
          isInitialSurvey: true,
          lampCount: 10,
          bulbType: '00000000-0000-0000-0000-000000000002',
          isIlluminantExchangeable: true,
          switchOnMode: 'motionTriggered',
          motionTriggerTimeout: 5,
          motionTriggerAvgTriggersPerDay: 30,
          avgRuntimePerYear: 300,
        },
      },
      {
        _id: '00000000-0000-0000-0000-000000000003',
        surveyId: 'illumination',
        userId: '00000000-0000-0000-0000-000000000000',
        realEstateId: '00000000-0000-0000-0000-000000000000',
        value: {
          realEstateName: 'CEO Office',
          isInitialSurvey: true,
          lampCount: 10,
          bulbType: '00000000-0000-0000-0000-000000000003',
          isIlluminantExchangeable: true,
          switchOnMode: 'timeTriggered',
          avgRuntimePerDay: 0.25,
          avgRuntimePerYear: 4,
        },
      },
      {
        _id: '00000000-0000-0000-0000-000000000004',
        surveyId: 'illumination',
        userId: '00000000-0000-0000-0000-000000000000',
        realEstateId: '00000000-0000-0000-0000-000000000000',
        value: {
          realEstateName: 'Main Hall',
          isInitialSurvey: true,
          lampCount: 123,
          bulbType: '00000000-0000-0000-0000-000000000001',
          isIlluminantExchangeable: true,
          switchOnMode: 'brightnessTriggered',
          avgRuntimePerDay: 0.3333333333333333,
        },
      },
    ];
  }
}
