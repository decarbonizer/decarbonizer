import { KnownSurveyId, SurveyToSurveyAnswerMap } from '../data/surveys/survey';
import { ApiObject, ApiObjectCreate, ApiObjectUpdate } from './apiObject';

export interface SurveyAnswer<T = object> extends ApiObject {
  realEstateId: string;
  surveyId: KnownSurveyId;
  value: T;
}

export interface SurveyAnswerCreate extends ApiObjectCreate {
  value: object;
}

export interface SurveyAnswerUpdate extends ApiObjectUpdate {
  value?: object;
}

/**
 * Evaluates whether the given survey answer relates to a known survey.
 * @param surveyType The type of survey to check for.
 * @param answer The survey answer.
 * @returns `true` if the survey answer's value has the shape of the known survey; `false` if not.
 */
export function isSurveyAnswerType<SurveyId extends KnownSurveyId>(
  surveyType: KnownSurveyId,
  answer: SurveyAnswer,
): answer is SurveyAnswer<SurveyToSurveyAnswerMap[SurveyId]> {
  return answer.surveyId === surveyType;
}
