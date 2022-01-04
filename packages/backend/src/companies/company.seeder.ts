import { Injectable } from '@nestjs/common';
import { DefaultDbSeeder } from '../debug/db.seeder';
import { CompanyRepository } from './company.repository';
import { Company } from './company.schema';

@Injectable()
export class CompanySeeder extends DefaultDbSeeder<Company> {
  constructor(companyRepository: CompanyRepository) {
    super(companyRepository);
  }

  protected override getSeed(): Array<Company> {
    return [
      {
        _id: '00000000-0000-0000-0000-000000000000',
        companyName: 'Capgemini',
      },
      {
        _id: '00000000-0000-0000-0000-000000000001',
        companyName: 'TUM',
      },
      {
        _id: '00000000-0000-0000-0000-000000000002',
        companyName: 'LMU',
      },
    ];
  }
}
