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
        _id: 'd8955a77-f60f-4ed8-aa5d-76917ce60919',
        actionAnswers: [
          {
            actionId: 'changeBulbs',
            values: {
              value: {
                newBulb: '00000000-0000-0000-0000-000000000003',
              },
              detailsValue: {
                surveyAnswers: [
                  '00000000-0000-0000-0000-000000000014',
                  '00000000-0000-0000-0000-000000000010',
                  '00000000-0000-0000-0000-000000000011',
                ],
                priority: 'high',
                chooseTimePeriod: {
                  startDate: new Date('2024-01-31T23:00:00.000Z'),
                },
              },
            },
          },
        ],
        realEstateId: '00000000-0000-0000-0000-000000000002',
        userId: '00000000-0000-0000-0000-000000000000',
        status: 'open',
        budget: 15000,
        endDate: new Date('2028-01-01T00:00:00.000Z'),
        startDate: new Date('2022-12-31T23:00:00.000Z'),
        name: 'Plan A',
      },
      {
        _id: '39ed5319-5d4f-402d-9ac7-1aa80f634fa8',
        actionAnswers: [
          {
            actionId: 'changeBulbs',
            values: {
              value: {
                newBulb: '00000000-0000-0000-0000-000000000003',
              },
              detailsValue: {
                priority: 'high',
              },
            },
          },
          {
            actionId: 'switchToHeatPump',
            values: {
              value: {
                newHeatPump: '00000000-0000-0000-0000-000000000001',
              },
              detailsValue: {
                priority: 'high',
              },
            },
          },
        ],
        realEstateId: '00000000-0000-0000-0000-000000000002',
        userId: '00000000-0000-0000-0000-000000000000',
        status: 'open',
        budget: 0,
        endDate: new Date('2035-01-01T00:00:00.000Z'),
        startDate: new Date('2028-12-31T23:00:00.000Z'),
        name: 'Plan B',
      },
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
