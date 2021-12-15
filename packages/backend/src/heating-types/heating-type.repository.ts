import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Repository } from '../common/db/repository';
import { HeatingType } from './heating-type.schema';

@Injectable()
export class HeatingTypeRepository extends Repository<HeatingType> {
  constructor(@InjectModel(HeatingType.name) model: Model<HeatingType>) {
    super(model);
  }
}
