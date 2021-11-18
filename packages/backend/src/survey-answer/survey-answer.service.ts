import { Injectable } from '@nestjs/common';
import { GenericCrudService } from '../common/services/generic-crud.service';
import { SurveyAnswerRepository } from './survey-answer.repository';
import { SurveyAnswer, SurveyAnswerUpdate } from './survey-answer.schema';

@Injectable()
export class SurveyAnswerService extends GenericCrudService<
  SurveyAnswer,
  SurveyAnswer,
  SurveyAnswerUpdate,
  SurveyAnswerRepository
> {
  constructor(messageRepository: SurveyAnswerRepository) {
    super(messageRepository);
  }

  async getAllForSurveyAndRealEstate(realEstateId: string, surveyId: string) {
    return await this.repository.getAllForSurveyAndRealEstate(realEstateId, surveyId);
  }

  async getAllForRealEstate(realEstateId: string) {
    return await this.repository.getAllForRealEstate(realEstateId);
  }

  protected mapCreateToEntity(entity: SurveyAnswer): SurveyAnswer {
    return entity;
  }

  protected mapUpdateToEntity(entity: SurveyAnswerUpdate): Partial<SurveyAnswer> {
    return entity;
  }
}
