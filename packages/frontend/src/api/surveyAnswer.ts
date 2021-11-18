import { ApiObject, ApiObjectCreate, ApiObjectUpdate } from './apiObject';

export interface SurveyAnswer<T = object> extends ApiObject {
  realEstateId: string;
  surveyId: string;
  value: T;
}

export interface SurveyAnswerCreate extends ApiObjectCreate {
  value: object;
}

export interface SurveyAnswerUpdate extends ApiObjectUpdate {
  value?: object;
}

//
// Possible manifestations of survey answer values.
//

export interface IlluminationSurveyAnswer {
  realEstateName: string;
  lampCount: number;
  bulbType: string;
  isIlluminantExchangeable: boolean;
  illuminationTriggerMode: 'automatically' | 'manually';
  illuminationTriggerEvent?: 'brightness' | 'timeTriggered' | 'motionTriggered';
  illuminationSwitchOffMode?: 'automaticTimeout' | 'manuallySwitchedOff';
  illuminationSwitchOnMode: 'always' | 'onDemand';
  avgIlluminationPerDay: number;
}

//
// Utils for matching/testing the untyped value of a survey answer.
//

type SurveyTypesWithAnswers = {
  illumination: IlluminationSurveyAnswer;
};

const surveyTypesToIdsMap: Record<keyof SurveyTypesWithAnswers, string> = {
  illumination: '00000000-0000-0000-0000-000000000000',
};

/**
 * Defines the different types of known surveys.
 */
export type SurveyType = keyof SurveyTypesWithAnswers;

/**
 * Evaluates whether the given survey answer relates to a known survey.
 * @param surveyType The type of survey to check for.
 * @param answer The survey answer.
 * @returns `true` if the survey answer's value has the shape of the known survey; `false` if not.
 */
export function isSurveyAnswerType<Type extends SurveyType>(
  surveyType: SurveyType,
  answer: SurveyAnswer,
): answer is SurveyAnswer<SurveyTypesWithAnswers[Type]> {
  return answer.surveyId === surveyTypesToIdsMap[surveyType];
}
