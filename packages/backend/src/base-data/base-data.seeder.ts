import { Injectable } from '@nestjs/common';
import { DefaultDbSeeder } from '../debug/db.seeder';
import { BaseDataRepository } from './base-data.repository';
import { BaseData } from './base-data.schema';

@Injectable()
export class BaseDataSeeder extends DefaultDbSeeder<BaseData> {
  constructor(baseDataRepository: BaseDataRepository) {
    super(baseDataRepository);
  }

  protected override getSeed(): Array<BaseData> {
    return [
      {
        realEstateId: '00000000-0000-0000-0000-000000000002',
        salaryElectricianMaintenanceWorkerPerHour: 12, // €/h
        timeToChangeOneBulb: 10, // min/Stk
        salaryItMaintenanceWorkerPerHour: 100, // €/h
        reductionFactorByUsingSuperServer: 0.3,
        superServerCost: 2000,
        normalServerCost: 1200,
        serverMaintenanceTime: 6, // h/stk
        serverLifeTime: 8, //years
        footPrintServer: 320, //Co2
        heatingKwHPerQm: 0.1,
        shortTravelEF: 0.15353,
        longTravelEF: 0.19309,
        illuminationEF: 0.624,
      },
      {
        _id: '00000000-0000-0000-0000-000000000002',
        illuminationEF: 0.624,
        longTravelEF: 0.19309,
        shortTravelEF: 0.15353,
        heatingKwHPerQm: 0.1,
        footPrintServer: 320,
        serverLifeTime: 8,
        serverMaintenanceTime: 6,
        normalServerCost: 1200,
        superServerCost: 2000,
        reductionFactorByUsingSuperServer: 0.3,
        salaryItMaintenanceWorkerPerHour: 100,
        timeToChangeOneBulb: 10,
        salaryElectricianMaintenanceWorkerPerHour: 125,
        realEstateId: '00000000-0000-0000-0000-000000000002',
      },
    ];
  }
}
