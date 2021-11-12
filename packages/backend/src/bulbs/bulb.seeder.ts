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
        productionKwh: 0.61,
        costInEuro: 0.5,
        lifetimeInHours: 1000,
      },
      {
        _id: '00000000-0000-0000-0000-000000000001',
        name: 'Bulb 710 lum',
        watt: 60,
        productionKwh: 0.61,
        costInEuro: 0.4,
        lifetimeInHours: 1500,
      },
      {
        _id: '00000000-0000-0000-0000-000000000002',
        name: 'LED 1300 lum',
        watt: 10,
        productionKwh: 9.9,
        costInEuro: 8.5,
        lifetimeInHours: 30000,
      },
      {
        _id: '00000000-0000-0000-0000-000000000003',
        name: 'LED 800 lum',
        watt: 6,
        productionKwh: 9.9,
        costInEuro: 5,
        lifetimeInHours: 30000,
      },
    ];
  }
}
