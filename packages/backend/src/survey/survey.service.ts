import { Injectable } from '@nestjs/common';
import { GenericCrudService } from '../common/services/generic-crud.service';
import { SurveyRepository } from './survey.repository';
import { Survey } from './survey.schema';

@Injectable()
export class SurveyService extends GenericCrudService<Survey, Survey, Survey, SurveyRepository> {
  constructor(surveyRepository: SurveyRepository) {
    super(surveyRepository);
  }
}
