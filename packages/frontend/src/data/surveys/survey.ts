import { FormSchema } from '../../form-engine/formSchema';
import { illuminationSurvey } from './illumination/illuminationSurvey';
import { IlluminationSurveyAnswerValue } from './illumination/illuminationSurveyAnswerValue';
import { heatingSurvey } from './heating/heatingSurvey';

export interface Survey {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
  schema: FormSchema;
}

export const knownSurveys = {
  [illuminationSurvey.id]: illuminationSurvey,
  [heatingSurvey.id]: heatingSurvey,
} as const;

export type SurveyToSurveyAnswerMap = {
  illumination: IlluminationSurveyAnswerValue;
  heating: any;
};

export type KnownSurveyId = keyof SurveyToSurveyAnswerMap;
