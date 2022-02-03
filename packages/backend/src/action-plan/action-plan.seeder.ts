import { Injectable } from '@nestjs/common';
import { DefaultDbSeeder } from '../debug/db.seeder';
import { ActionPlanRepository } from './action-plan.repository';
import { ActionPlan } from './action-plan.schema';

@Injectable()
export class ActionPlanSeeder extends DefaultDbSeeder<ActionPlan> {
  constructor(actionPlanRepository: ActionPlanRepository) {
    super(actionPlanRepository);
  }

  protected override getSeed(): Array<ActionPlan> {
    return [
      {
        _id: 'a0214d5d-17b0-4b39-9ece-ea7a53cd6869',
        actionAnswers: [
          {
            actionId: 'changeBulbs',
            values: {
              value: { newBulb: '00000000-0000-0000-0000-000000000003' },
              detailsValue: { surveyAnswers: ['00000000-0000-0000-0000-000000000014'] },
            },
          },
          {
            actionId: 'reduceRuntime',
            values: {
              value: { dailyRuntimeReductionInDays: 0.03125 },
              detailsValue: {
                surveyAnswers: ['00000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000013'],
              },
            },
          },
          {
            actionId: 'increaseDataCenterTemperature',
            values: { value: { newDataCenterTemperature: 25 } },
          },
          {
            actionId: 'switchToGreenEnergy',
            values: {
              value: { newEnergyForm: '00000000-0000-0000-0000-000000000004' },
              detailsValue: {
                surveyAnswers: ['cd528854-3983-40fa-9e17-72bdd701b55f', 'cd528854-3983-40fa-9e17-72bdd701b55d'],
              },
            },
          },
        ],
        realEstateId: '00000000-0000-0000-0000-000000000002',
        userId: '00000000-0000-0000-0000-000000000000',
        status: 'open',
        budget: 0,
        endDate: new Date('2033-02-28T23:00:00.000Z'),
        startDate: new Date('2028-02-29T23:00:00.000Z'),
        name: "Patrik's Plan",
      },
      {
        _id: '7501ec26-6fb3-4af1-9e42-a96dfbc9a5e1',
        actionAnswers: [
          {
            actionId: 'changeBulbs',
            values: {
              value: { newBulb: '00000000-0000-0000-0000-000000000003' },
              detailsValue: {
                surveyAnswers: ['00000000-0000-0000-0000-000000000014', '00000000-0000-0000-0000-000000000010'],
              },
            },
          },
          {
            actionId: 'switchToHeatPump',
            values: {
              value: { newHeatPump: '00000000-0000-0000-0000-000000000001' },
              detailsValue: {
                surveyAnswers: ['a94b9d03-6d0b-4df7-b1ce-7360ef5dcc42', 'a94b9d03-6d0b-4df7-b1ce-7360ef5dcc44'],
              },
            },
          },
          {
            actionId: 'switchToGreenEnergy',
            values: {
              value: { newEnergyForm: '00000000-0000-0000-0000-000000000000' },
              detailsValue: { surveyAnswers: ['cd528854-3983-40fa-9e17-72bdd701b55f'] },
            },
          },
          {
            actionId: 'increaseDataCenterTemperature',
            values: { value: { newDataCenterTemperature: 20 } },
          },
        ],
        realEstateId: '00000000-0000-0000-0000-000000000002',
        userId: '00000000-0000-0000-0000-000000000000',
        status: 'open',
        budget: 15000,
        endDate: new Date('2028-01-31T23:00:00.000Z'),
        startDate: new Date('2023-02-28T23:00:00.000Z'),
        name: "Peter's Plan",
      },
      // {
      //   _id: 'd8955a77-f60f-4ed8-aa5d-76917ce60919',
      //   actionAnswers: [
      //     {
      //       actionId: 'changeBulbs',
      //       values: {
      //         value: {
      //           newBulb: '00000000-0000-0000-0000-000000000003',
      //         },
      //         detailsValue: {
      //           surveyAnswers: ['00000000-0000-0000-0000-000000000014', '00000000-0000-0000-0000-000000000010'],
      //           priority: 'high',
      //           chooseTimePeriod: {
      //             startDate: '2024-01-31T23:00:00.000Z',
      //           },
      //         },
      //       },
      //     },
      //   ],
      //   realEstateId: '00000000-0000-0000-0000-000000000002',
      //   userId: '00000000-0000-0000-0000-000000000000',
      //   status: 'open',
      //   budget: 1500,
      //   endDate: new Date('2027-01-01T00:00:00.000Z'),
      //   startDate: new Date('2022-12-31T23:00:00.000Z'),
      //   name: 'Plan A',
      // },
      // {
      //   _id: '39ed5319-5d4f-402d-9ac7-1aa80f634fa8',
      //   actionAnswers: [
      //     {
      //       actionId: 'changeBulbs',
      //       values: {
      //         value: {
      //           newBulb: '00000000-0000-0000-0000-000000000003',
      //         },
      //         detailsValue: {
      //           priority: 'high',
      //         },
      //       },
      //     },
      //     {
      //       actionId: 'switchToHeatPump',
      //       values: {
      //         value: {
      //           newHeatPump: '00000000-0000-0000-0000-000000000001',
      //         },
      //         detailsValue: {
      //           priority: 'high',
      //           chooseTimePeriod: {
      //             startDate: new Date('2030-01-31T23:00:00.000Z'),
      //           },
      //         },
      //       },
      //     },
      //   ],
      //   realEstateId: '00000000-0000-0000-0000-000000000002',
      //   userId: '00000000-0000-0000-0000-000000000000',
      //   status: 'open',
      //   budget: 0,
      //   endDate: new Date('2035-01-01T00:00:00.000Z'),
      //   startDate: new Date('2026-12-31T23:00:00.000Z'),
      //   name: 'Plan B',
      // },
      // {
      //   _id: 'dbdf56a0-91db-4cbe-8bd8-6bf0c4644d54',
      //   actionAnswers: [
      //     {
      //       actionId: 'increaseDataCenterTemperature',
      //       values: {
      //         value: {
      //           newDataCenterTemperature: 20,
      //         },
      //       },
      //     },
      //     {
      //       actionId: 'useSuperServer',
      //       values: {
      //         value: {
      //           newServer: true,
      //         },
      //         detailsValue: {
      //           chooseTimePeriod: {
      //             startDate: new Date('2039-01-31T23:00:00.000Z'),
      //           },
      //           priority: 'high',
      //         },
      //       },
      //     },
      //     {
      //       actionId: 'switchToGreenEnergy',
      //       values: {
      //         value: {
      //           newEnergyForm: '00000000-0000-0000-0000-000000000000',
      //         },
      //         detailsValue: {
      //           chooseTimePeriod: {
      //             startDate: new Date('2034-01-31T23:00:00.000Z'),
      //           },
      //           priority: 'high',
      //         },
      //       },
      //     },
      //   ],
      //   realEstateId: '00000000-0000-0000-0000-000000000002',
      //   userId: '00000000-0000-0000-0000-000000000000',
      //   status: 'open',
      //   budget: 0,
      //   endDate: new Date('2040-01-01T00:00:00.000Z'),
      //   startDate: new Date('2035-01-31T23:00:00.000Z'),
      //   name: 'Plan C',
      // },
    ];
  }
}
