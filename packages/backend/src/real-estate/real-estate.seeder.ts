import { Injectable } from '@nestjs/common';
import { DefaultDbSeeder } from '../debug/db.seeder';
import { RealEstateRepository } from './real-estate.repository';
import { RealEstate } from './real-estate.schema';

@Injectable()
export class RealEstateSeeder extends DefaultDbSeeder<RealEstate> {
  constructor(userRepository: RealEstateRepository) {
    super(userRepository);
  }

  protected override getSeed(): Array<RealEstate> {
    return [
      {
        _id: '00000000-0000-0000-0000-000000000000',
        cityName: 'Ratingen',
        description: '3 floors of a 6-floored building.',
        employees: 551,
        area: 2300
      },
      {
        _id: '00000000-0000-0000-0000-000000000001',
        cityName: 'Berlin',
        description: '4 floors of a 14-floored building.',
        employees: 618,
        area: 3000
      },
      {
        _id: '00000000-0000-0000-0000-000000000002',
        cityName: 'Munich',
        description: 'The entire building except for a small area in the 4th floor.',
        employees: 1168,
        area: 4000
      },
      {
        _id: '00000000-0000-0000-0000-000000000003',
        cityName: 'Stuttgart',
        description: '3 floors of a 5-floored building.',
        employees: 450,
        area: 2000
      },
    ];
  }
}
