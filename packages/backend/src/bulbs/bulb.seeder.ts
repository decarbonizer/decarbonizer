import { Injectable } from '@nestjs/common';
import { DefaultDbSeeder } from '../debug/db.seeder';
import { BulbRepository } from './bulb.repository';
import { Bulb } from './bulb.schema';

@Injectable()
export class BulbSeeder extends DefaultDbSeeder<Bulb> {
  constructor(bulbRepository: BulbRepository) {
    super(bulbRepository);
  }

  protected override getSeed(): Array<Bulb> {
    return [
      {
        _id: '00000000-0000-0000-0000-000000000000',
        name: 'Bulb 1380 lum',
        watt: 100,
        productionKwh: 0.1,
        costInEuro: 4.99,
        lifetimeInHours: 1000,
      },
      {
        _id: '00000000-0000-0000-0000-000000000001',
        name: 'Bulb 710 lum',
        watt: 60,
        productionKwh: 0.06,
        costInEuro: 0.89,
        lifetimeInHours: 1500,
      },
      {
        _id: '00000000-0000-0000-0000-000000000002',
        name: 'LED 1300 lum',
        watt: 10,
        productionKwh: 0.01,
        costInEuro: 19.95,
        lifetimeInHours: 30000,
      },
      {
        _id: '00000000-0000-0000-0000-000000000003',
        name: 'LED 800 lum',
        watt: 6,
        productionKwh: 0.006,
        costInEuro: 7.99,
        lifetimeInHours: 30000,
      },
    ];
  }
}
