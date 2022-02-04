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
        companyId: '00000000-0000-0000-0000-000000000000',
        description: '3 floors of a 6-floored building.',
        employees: 551,
        area: 2300,
      },
      {
        _id: '00000000-0000-0000-0000-000000000001',
        cityName: 'Berlin',
        companyId: '00000000-0000-0000-0000-000000000000',
        description: '4 floors of a 14-floored building.',
        employees: 618,
        area: 3000,
        image:
          'https://images.unsplash.com/photo-1587330979470-3595ac045ab0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
      },
      {
        _id: '00000000-0000-0000-0000-000000000002',
        cityName: 'Hamburg',
        companyId: '00000000-0000-0000-0000-000000000000',
        description: 'The entire building except for a small area in the 4th floor.',
        employees: 1168,
        area: 4000,
        image:
          'https://images.unsplash.com/photo-1589797268350-44b2cbae816e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
      },
      {
        _id: '00000000-0000-0000-0000-000000000003',
        cityName: 'Stuttgart',
        companyId: '00000000-0000-0000-0000-000000000000',
        description: '3 floors of a 5-floored building.',
        employees: 450,
        area: 2000,
        image:
          'https://images.unsplash.com/photo-1587196824241-2a289b7d1693?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
      },
    ];
  }
}
