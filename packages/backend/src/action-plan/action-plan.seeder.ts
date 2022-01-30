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
        _id: '6072d9ed-bb02-4809-a1a0-a677a60e35ff',
        name: 'Dieter Plan 2022',
        realEstateId: '00000000-0000-0000-0000-000000000002',
        userId: '00000000-0000-0000-0000-000000000000',
        startDate: new Date('2028-01-01T01:00:00.000Z'),
        endDate: new Date('2036-01-01T01:00:00.000Z'),
        budget: 0,
        status: 'open',
        actionAnswers: [
          {
            actionId: 'changeBulbs',
            values: {
              value: {
                newBulb: '00000000-0000-0000-0000-000000000000',
              },
            },
          },
          {
            actionId: 'integrateSmartRadiatorThermostats',
            values: {
              value: {
                newSmartTemperature: true,
              },
            },
          },
          {
            actionId: 'switchToHeatPump',
            values: {
              value: {
                newHeatPump: '00000000-0000-0000-0000-000000000001',
              },
            },
          },
          {
            actionId: 'switchToGreenEnergy',
            values: {
              value: {
                newEnergyForm: '00000000-0000-0000-0000-000000000009',
              },
            },
          },
        ],
      },
      {
        _id: '77a11e98-9c73-4273-ae6e-ae650cfe6030',
        name: 'Hans Plan 2022',
        realEstateId: '00000000-0000-0000-0000-000000000002',
        userId: '00000000-0000-0000-0000-000000000000',
        startDate: new Date('2022-01-01T01:00:00.000Z'),
        endDate: new Date('2028-01-01T01:00:00.000Z'),
        budget: 0,
        status: 'open',
        actionAnswers: [
          {
            actionId: 'changeBulbs',
            values: {
              value: {
                newBulb: '00000000-0000-0000-0000-000000000003',
              },
            },
          },
        ],
      },
    ];
  }
}
