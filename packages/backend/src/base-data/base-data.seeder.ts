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
        salaryElectricianMaintenanceWorkerPerHour: 12,
        realEstateId: '00000000-0000-0000-0000-000000000002',
      },
    ];
  }
}
