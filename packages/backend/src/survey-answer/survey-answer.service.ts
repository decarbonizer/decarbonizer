import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { GenericCrudService } from '../common/services/generic-crud.service';
import { SurveyAnswerRepository } from './survey-answer.repository';
import { SurveyAnswer, SurveyAnswerUpdate } from './survey-answer.schema';

@Injectable()
export class SurveyAnswerService extends GenericCrudService<
  SurveyAnswer,
  Omit<SurveyAnswer, 'userId'>,
  SurveyAnswerUpdate,
  SurveyAnswerRepository
> {
  constructor(surveyAnswerRepository: SurveyAnswerRepository, private readonly authService: AuthService) {
    super(surveyAnswerRepository);
  }

  async getAllForCurrentUser() {
    const userId = this.authService.getCurrentUserId();
    return await this.repository.getAll({ userId });
  }

  async getAllForSurveyAndRealEstate(realEstateId: string, surveyId: string) {
    const userId = this.authService.getCurrentUserId();
    return await this.repository.getAll({ userId, realEstateId, surveyId });
  }

  async getAllForRealEstate(realEstateId: string) {
    const userId = this.authService.getCurrentUserId();
    return await this.repository.getAll({ userId, realEstateId });
  }

  protected async mapCreateToEntity(entity: Omit<SurveyAnswer, 'userId'>): Promise<SurveyAnswer> {
    return { ...entity, userId: this.authService.getCurrentUserId() };
  }

  protected async mapUpdateToEntity(entity: SurveyAnswerUpdate): Promise<Partial<SurveyAnswer>> {
    return entity;
  }
}
