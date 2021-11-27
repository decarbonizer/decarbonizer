import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Repository } from '../common/db/repository';
import { Survey } from './survey.schema';

@Injectable()
export class SurveyRepository extends Repository<Survey> {
  constructor(@InjectModel(Survey.name) model: Model<Survey>) {
    super(model);
  }

  async getByIdOrIdentifier(idOrIdentifier: string) {
    const result = await this.model.findOne({
      $or: [{ _id: idOrIdentifier }, { identifier: idOrIdentifier }],
    });

    if (!result) {
      throw new NotFoundException(`No survey with the ID or identifier ${idOrIdentifier} could be found.`);
    }

    return result;
  }
}
