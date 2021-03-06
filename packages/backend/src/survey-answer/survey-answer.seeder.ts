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
      {
        _id: '00000000-0000-0000-0000-000000000010',
        surveyId: 'illumination',
        userId: '00000000-0000-0000-0000-000000000000',
        realEstateId: '00000000-0000-0000-0000-000000000002',
        value: {
          realEstateName: 'Reception',
          isInitialSurvey: true,
          lampCount: 20,
          bulbType: '00000000-0000-0000-0000-000000000000',
          isIlluminantExchangeable: true,
          switchOnMode: 'always',
        },
      },
      {
        _id: '00000000-0000-0000-0000-000000000011',
        surveyId: 'illumination',
        userId: '00000000-0000-0000-0000-000000000000',
        realEstateId: '00000000-0000-0000-0000-000000000002',
        value: {
          realEstateName: 'Conference room',
          isInitialSurvey: true,
          lampCount: 15,
          bulbType: '00000000-0000-0000-0000-000000000001',
          isIlluminantExchangeable: true,
          switchOnMode: 'manually',
          avgRuntimePerDay: 0.3333333333333333,
          avgRuntimePerYear: 200,
        },
      },
      {
        _id: '00000000-0000-0000-0000-000000000012',
        surveyId: 'illumination',
        userId: '00000000-0000-0000-0000-000000000000',
        realEstateId: '00000000-0000-0000-0000-000000000002',
        value: {
          realEstateName: 'Bathroom',
          isInitialSurvey: true,
          lampCount: 5,
          bulbType: '00000000-0000-0000-0000-000000000002',
          isIlluminantExchangeable: true,
          switchOnMode: 'motionTriggered',
          motionTriggerTimeout: 5,
          motionTriggerAvgTriggersPerDay: 30,
          avgRuntimePerYear: 300,
        },
      },
      {
        _id: '00000000-0000-0000-0000-000000000013',
        surveyId: 'illumination',
        userId: '00000000-0000-0000-0000-000000000000',
        realEstateId: '00000000-0000-0000-0000-000000000002',
        value: {
          realEstateName: 'CEO Office',
          isInitialSurvey: true,
          lampCount: 15,
          bulbType: '00000000-0000-0000-0000-000000000003',
          isIlluminantExchangeable: true,
          switchOnMode: 'timeTriggered',
          avgRuntimePerDay: 5,
          avgRuntimePerYear: 100,
        },
      },
      {
        _id: '00000000-0000-0000-0000-000000000014',
        surveyId: 'illumination',
        userId: '00000000-0000-0000-0000-000000000000',
        realEstateId: '00000000-0000-0000-0000-000000000002',
        value: {
          realEstateName: 'Main Hall',
          isInitialSurvey: true,
          lampCount: 200,
          bulbType: '00000000-0000-0000-0000-000000000001',
          isIlluminantExchangeable: true,
          switchOnMode: 'brightnessTriggered',
          avgRuntimePerDay: 0.3333333333333333,
        },
      },
      {
        _id: '00000000-0000-0000-0000-000000000020',
        surveyId: 'illumination',
        userId: '00000000-0000-0000-0000-000000000000',
        realEstateId: '00000000-0000-0000-0000-000000000003',
        value: {
          realEstateName: 'Bathroom',
          isInitialSurvey: true,
          lampCount: 5,
          bulbType: '00000000-0000-0000-0000-000000000002',
          isIlluminantExchangeable: true,
          switchOnMode: 'motionTriggered',
          motionTriggerTimeout: 5,
          motionTriggerAvgTriggersPerDay: 30,
          avgRuntimePerYear: 300,
        },
      },
      {
        _id: '00000000-0000-0000-0000-000000000021',
        surveyId: 'illumination',
        userId: '00000000-0000-0000-0000-000000000000',
        realEstateId: '00000000-0000-0000-0000-000000000003',
        value: {
          realEstateName: 'CEO Office',
          isInitialSurvey: true,
          lampCount: 15,
          bulbType: '00000000-0000-0000-0000-000000000003',
          isIlluminantExchangeable: true,
          switchOnMode: 'timeTriggered',
          avgRuntimePerDay: 5,
          avgRuntimePerYear: 100,
        },
      },
      {
        _id: '00000000-0000-0000-0000-000000000022',
        surveyId: 'illumination',
        userId: '00000000-0000-0000-0000-000000000000',
        realEstateId: '00000000-0000-0000-0000-000000000003',
        value: {
          realEstateName: 'Main Hall',
          isInitialSurvey: true,
          lampCount: 200,
          bulbType: '00000000-0000-0000-0000-000000000001',
          isIlluminantExchangeable: true,
          switchOnMode: 'brightnessTriggered',
          avgRuntimePerDay: 0.3333333333333333,
        },
      },
      {
        _id: '00000000-0000-0000-0000-000000000030',
        surveyId: 'illumination',
        userId: '00000000-0000-0000-0000-000000000000',
        realEstateId: '00000000-0000-0000-0000-000000000001',
        value: {
          realEstateName: 'CEO Office',
          isInitialSurvey: true,
          lampCount: 15,
          bulbType: '00000000-0000-0000-0000-000000000003',
          isIlluminantExchangeable: true,
          switchOnMode: 'timeTriggered',
          avgRuntimePerDay: 5,
          avgRuntimePerYear: 100,
        },
      },
      {
        _id: '00000000-0000-0000-0000-000000000031',
        surveyId: 'illumination',
        userId: '00000000-0000-0000-0000-000000000000',
        realEstateId: '00000000-0000-0000-0000-000000000001',
        value: {
          realEstateName: 'Main Hall',
          isInitialSurvey: true,
          lampCount: 200,
          bulbType: '00000000-0000-0000-0000-000000000001',
          isIlluminantExchangeable: true,
          switchOnMode: 'brightnessTriggered',
          avgRuntimePerDay: 0.3333333333333333,
        },
      },
      {
        _id: 'a94b9d03-6d0b-4df7-b1ce-7360ef5dcc44',
        surveyId: 'heating',
        userId: '00000000-0000-0000-0000-000000000000',
        realEstateId: '00000000-0000-0000-0000-000000000002',
        value: {
          realEstateName: 'Reception',
          realEstateAreaInQm: 20,
          isInitialSurvey: true,
          radiatorKind: '00000000-0000-0000-0000-000000000004',
          roomTemperature: 25,
          smartThermostats: false,
          avgHeatingPerYear: 200,
        },
      },
      {
        _id: 'a94b9d03-6d0b-4df7-b1ce-7360ef5dcc44',
        surveyId: 'heating',
        userId: '00000000-0000-0000-0000-000000000000',
        realEstateId: '00000000-0000-0000-0000-000000000002',
        value: {
          realEstateName: 'Reception',
          realEstateAreaInQm: 20,
          isInitialSurvey: true,
          radiatorKind: '00000000-0000-0000-0000-000000000003',
          roomTemperature: 25,
          smartThermostats: false,
          avgHeatingPerYear: 200,
        },
      },
      {
        _id: 'a94b9d03-6d0b-4df7-b1ce-7360ef5dcc42',
        surveyId: 'heating',
        userId: '00000000-0000-0000-0000-000000000000',
        realEstateId: '00000000-0000-0000-0000-000000000002',
        value: {
          realEstateName: 'CEO Office',
          realEstateAreaInQm: 25,
          isInitialSurvey: true,
          radiatorKind: '00000000-0000-0000-0000-000000000004',
          roomTemperature: 25,
          smartThermostats: true,
          avgHeatingPerYear: 100,
        },
      },
      {
        _id: 'a94b9d03-6d0b-4df7-b1ce-7360ef5dcc43',
        surveyId: 'heating',
        userId: '00000000-0000-0000-0000-000000000000',
        realEstateId: '00000000-0000-0000-0000-000000000002',
        value: {
          realEstateName: 'Offices',
          realEstateAreaInQm: 100,
          isInitialSurvey: true,
          radiatorKind: '00000000-0000-0000-0000-000000000002',
          roomTemperature: 23,
          smartThermostats: false,
          avgHeatingPerYear: 280,
        },
      },
      {
        _id: 'cd528854-3983-40fa-9e17-72bdd701b55d',
        surveyId: 'electricity',
        userId: '00000000-0000-0000-0000-000000000000',
        realEstateId: '00000000-0000-0000-0000-000000000002',

        value: {
          realEstateName: 'Offices',
          isInitialSurvey: true,
          energyForm: '00000000-0000-0000-0000-000000000006',
          avgConsumptionPerYear: 20,
        },
      },
      {
        _id: 'cd528854-3983-40fa-9e17-72bdd701b55f',
        surveyId: 'electricity',
        userId: '00000000-0000-0000-0000-000000000000',
        realEstateId: '00000000-0000-0000-0000-000000000002',
        value: {
          realEstateName: 'Offices',
          isInitialSurvey: true,
          energyForm: '00000000-0000-0000-0000-000000000003',
          avgConsumptionPerYear: 50,
        },
      },
      {
        _id: 'cd528854-3983-40fa-9e17-72bdd701b55e',
        surveyId: 'electricity',
        userId: '00000000-0000-0000-0000-000000000000',
        realEstateId: '00000000-0000-0000-0000-000000000001',
        value: {
          realEstateName: 'Offices',
          isInitialSurvey: true,
          energyForm: '00000000-0000-0000-0000-000000000003',
          avgConsumptionPerYear: 50,
        },
      },
      {
        _id: 'cce9da83-434c-4616-9374-659d821d1949',
        value: {
          realEstateName: 'Data Center 1',
          isInitialSurvey: true,
          dataCenterEnergyForm: '00000000-0000-0000-0000-000000000010',
          dataCenterTemperature: 17,
          gpuServerCount: 3,
          dataCenterConsumption: 20000,
        },
        realEstateId: '00000000-0000-0000-0000-000000000002',
        surveyId: 'it',
        userId: '00000000-0000-0000-0000-000000000000',
      },
      {
        _id: '72ade50e-23fa-433d-b7a1-0d1d9767dbe5',
        value: {
          isInitialSurvey: true,
          longTraveling: 43030,
          shortTraveling: 10000,
          employeeName: 'Max Mustermann',
        },
        realEstateId: '00000000-0000-0000-0000-000000000002',
        surveyId: 'businessTravel',
        userId: '00000000-0000-0000-0000-000000000000',
      },
      {
        _id: '3b267a53-da9c-4c4c-ac73-d336d1246b76',
        value: {
          realEstateName: 'Data Center 2',
          isInitialSurvey: true,
          dataCenterEnergyForm: '00000000-0000-0000-0000-000000000009',
          dataCenterTemperature: 17,
          gpuServerCount: 2,
          dataCenterConsumption: 7000,
        },
        realEstateId: '00000000-0000-0000-0000-000000000002',
        surveyId: 'it',
        userId: '00000000-0000-0000-0000-000000000000',
      },
    ];
  }
}
