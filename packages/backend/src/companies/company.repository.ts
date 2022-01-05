import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Repository } from '../common/db/repository';
import { Company } from './company.schema';

@Injectable()
export class CompanyRepository extends Repository<Company> {
  constructor(@InjectModel(Company.name) model: Model<Company>) {
    super(model);
  }
}
