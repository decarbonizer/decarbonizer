import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Repository } from '../common/db/repository';
import { ActionPlan } from './action-plan.schema';

@Injectable()
export class ActionPlanRepository extends Repository<ActionPlan> {
  constructor(@InjectModel(ActionPlan.name) model: Model<ActionPlan>) {
    super(model);
  }
}
