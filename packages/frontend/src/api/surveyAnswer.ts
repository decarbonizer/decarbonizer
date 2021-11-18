import { ApiObject, ApiObjectCreate, ApiObjectUpdate } from './apiObject';

export interface SurveyAnswer extends ApiObject {
  realEstateId: string;
  surveyId: string;
  value: object;
}

export interface SurveyAnswerCreate extends ApiObjectCreate {
  value: object;
}

export interface SurveyAnswerUpdate extends ApiObjectUpdate {
  value?: object;
}
