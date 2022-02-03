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
          { actionId: 'changeBulbs', values: { value: { newBulb: '00000000-0000-0000-0000-000000000003' } } },
          {
            actionId: 'reduceRuntime',
            values: { value: { dailyRuntimeReductionInDays: 0.03125 } },
          },
          { actionId: 'useSuperServer', values: { value: { newServer: true } } },
          {
            actionId: 'increaseDataCenterTemperature',
            values: { value: { newDataCenterTemperature: 25 } },
          },
          {
            actionId: 'switchToGreenEnergy',
            values: { value: { newEnergyForm: '00000000-0000-0000-0000-000000000004' } },
          },
        ],
        realEstateId: '00000000-0000-0000-0000-000000000002',
        userId: '00000000-0000-0000-0000-000000000000',
        status: 'open',
        budget: 0,
        endDate: new Date('2033-02-28T23:00:00.000Z'),
        startDate: new Date('2028-02-28T23:00:00.000Z'),
        name: "Patrik's Plan",
      },
      {
        _id: '7501ec26-6fb3-4af1-9e42-a96dfbc9a5e1',
        actionAnswers: [
          { actionId: 'changeBulbs', values: { value: { newBulb: '00000000-0000-0000-0000-000000000003' } } },
          { actionId: 'switchToHeatPump', values: { value: { newHeatPump: '00000000-0000-0000-0000-000000000001' } } },
          {
            actionId: 'switchToGreenEnergy',
            values: { value: { newEnergyForm: '00000000-0000-0000-0000-000000000000' } },
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
    ];
  }
}
