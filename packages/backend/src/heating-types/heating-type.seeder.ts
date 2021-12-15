import { Injectable } from '@nestjs/common';
import { DefaultDbSeeder } from '../debug/db.seeder';
import { HeatingTypeRepository } from './heating-type.repository';
import { HeatingType } from './heating-type.schema';
@Injectable()
export class HeatingTypeSeeder extends DefaultDbSeeder<HeatingType> {
  constructor(heatingTypeRepository: HeatingTypeRepository) {
    super(heatingTypeRepository);
  }

  protected override getSeed(): Array<HeatingType> {
    return [
      {
        _id: '00000000-0000-0000-0000-000000000000',
        name: 'Solar thermal',
        energyForm: '00000000-0000-0000-0000-000000000004',
        productionKwh: 0.25,
        consumptionKwh: 0,
        installationCostInEuro: 200,
      },
      {
        _id: '00000000-0000-0000-0000-000000000001',
        name: 'Ground source heat pump',
        energyForm: '00000000-0000-0000-0000-000000000002',
        productionKwh: 4,
        consumptionKwh: 1,
        installationCostInEuro: 25000,
      },
      {
        _id: '00000000-0000-0000-0000-000000000002',
        name: 'Air source heat pump',
        energyForm: '00000000-0000-0000-0000-000000000003',
        productionKwh: 3,
        consumptionKwh: 1,
        installationCostInEuro: 7000,
      },
      {
        _id: '00000000-0000-0000-0000-000000000003',
        name: 'Direct electric heating',
        energyForm: '00000000-0000-0000-0000-000000000010',
        productionKwh: 1.5,
        consumptionKwh: 1.5,
        installationCostInEuro: 21000,
      },
      {
        _id: '00000000-0000-0000-0000-000000000004',
        name: 'Gas boiler',
        energyForm: '00000000-0000-0000-0000-000000000007',
        productionKwh: 1,
        consumptionKwh: 1,
        installationCostInEuro: 5000,
      },
      {
        _id: '00000000-0000-0000-0000-000000000005',
        name: 'Oil boiler',
        energyForm: '00000000-0000-0000-0000-000000000009',
        productionKwh: 1, //TODO: do research for these numbers
        consumptionKwh: 1,
        installationCostInEuro: 7000,
      },
    ];
  }
}
