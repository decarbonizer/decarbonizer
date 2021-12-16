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
        name: 'Dieter',
        realEstateId: '00000000-0000-0000-0000-000000000002',
        userId: '00000000-0000-0000-0000-000000000000',
        endDate: new Date('2022-01-30T23:00:00.000Z'),
        startDate: new Date('2021-12-31T23:00:00.000Z'),
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
        name: 'Hans',
        realEstateId: '00000000-0000-0000-0000-000000000002',
        userId: '00000000-0000-0000-0000-000000000000',
        endDate: new Date('2021-12-30T23:00:00.000Z'),
        startDate: new Date('2021-12-20T23:00:00.000Z'),
        status: 'inProgress',
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
