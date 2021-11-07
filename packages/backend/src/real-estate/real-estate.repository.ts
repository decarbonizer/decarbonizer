import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Repository } from '../common/db/repository';
import { RealEstate } from './real-estate.schema';

@Injectable()
export class RealEstateRepository extends Repository<RealEstate> {
  constructor(@InjectModel(RealEstate.name) model: Model<RealEstate>) {
    super(model);
  }
}
