import { Injectable } from '@nestjs/common';
import { DefaultDbSeeder } from '../debug/db.seeder';
import { EnergyFormRepository } from './energy-form.repository';
import { EnergyForm } from './energy-form.schema';

@Injectable()
export class EnergyFormSeeder extends DefaultDbSeeder<EnergyForm> {
  constructor(energyFormRepository: EnergyFormRepository) {
    super(energyFormRepository);
  }

  protected override getSeed(): Array<EnergyForm> {
    return [
      {
        _id: '00000000-0000-0000-0000-000000000000',
        name: 'Nuclear Power',
        co2PerGramPerKwh: 12,
        euroPerKwh: 0.25,
      },
      {
        _id: '00000000-0000-0000-0000-000000000001',
        name: 'Water Power',
        co2PerGramPerKwh: 24,
        euroPerKwh: 0.15,
      },
      {
        _id: '00000000-0000-0000-0000-000000000002',
        name: 'Geothermal',
        co2PerGramPerKwh: 38,
        euroPerKwh: 0.08,
      },
      {
        _id: '00000000-0000-0000-0000-000000000003',
        name: 'Wind Power',
        co2PerGramPerKwh: 86,
        euroPerKwh: 0.06,
      },
      {
        _id: '00000000-0000-0000-0000-000000000004',
        name: 'Solar Power',
        co2PerGramPerKwh: 143,
        euroPerKwh: 0.06,
      },
      {
        _id: '00000000-0000-0000-0000-000000000005',
        name: 'Bio Gas',
        co2PerGramPerKwh: 230,
        euroPerKwh: 0.25,
      },
      {
        _id: '00000000-0000-0000-0000-000000000006',
        name: 'Stone Coal Power',
        co2PerGramPerKwh: 798,
        euroPerKwh: 0.25,
      },
      {
        _id: '00000000-0000-0000-0000-000000000007',
        name: 'Gas Power',
        co2PerGramPerKwh: 819,
        euroPerKwh: 0.06,
      },
      {
        _id: '00000000-0000-0000-0000-000000000008',
        name: 'Brown Coal Power',
        co2PerGramPerKwh: 1150,
        euroPerKwh: 0.25,
      },
      {
        _id: '00000000-0000-0000-0000-000000000009',
        name: 'Heating Oil Power',
        co2PerGramPerKwh: 303,
        euroPerKwh: 0.46,
      },
      {
        _id: '00000000-0000-0000-0000-000000000010',
        name: 'Electricity Power',
        co2PerGramPerKwh: 219,
        euroPerKwh: 0.31,
      },
    ];
  }
}
