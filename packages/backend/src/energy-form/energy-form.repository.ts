import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Repository } from '../common/db/repository';
import { EnergyForm } from './energy-form.schema';

@Injectable()
export class EnergyFormRepository extends Repository<EnergyForm> {
  constructor(@InjectModel(EnergyForm.name) model: Model<EnergyForm>) {
    super(model);
  }
}
