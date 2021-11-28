import { FormSchema } from '../../form-engine/formSchema';
import { illuminationSurvey } from './illumination/illuminationSurvey';
import { IlluminationSurveyAnswerValue } from './illumination/illuminationSurveyAnswerValue';

export interface Survey {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
  schema: FormSchema;
}

export const knownSurveys = {
  [illuminationSurvey.id]: illuminationSurvey,
} as const;

export type SurveyToSurveyAnswerMap = {
  illumination: IlluminationSurveyAnswerValue;
};

export type KnownSurveyId = keyof SurveyToSurveyAnswerMap;
