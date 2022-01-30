import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Repository } from '../common/db/repository';
import { BaseData } from './base-data.schema';

@Injectable()
export class BaseDataRepository extends Repository<BaseData> {
  constructor(@InjectModel(BaseData.name) model: Model<BaseData>) {
    super(model);
  }
}
