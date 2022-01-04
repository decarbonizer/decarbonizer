import { Injectable } from '@nestjs/common';
import { GenericCrudService } from '../common/services/generic-crud.service';
import { CompanyRepository } from './company.repository';
import { Company } from './company.schema';

@Injectable()
export class CompanyService extends GenericCrudService<Company, Company, Company, CompanyRepository> {
  constructor(companyRepository: CompanyRepository) {
    super(companyRepository);
  }
}
