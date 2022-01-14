import { FormSchema } from '../../form-engine/formSchema';
import { illuminationSurvey } from './illumination/illuminationSurvey';
import { IlluminationSurveyAnswerValue } from './illumination/illuminationSurveyAnswerValue';
import { heatingSurvey } from './heating/heatingSurvey';
import { HeatingSurveyAnswerValue } from './heating/heatingSurveyAnswerValue';
import { electricitySurvey } from './electricity/electricitySurvey';
import { ElectricitySurveyAnswerValue } from './electricity/electricitySurveyAnswerValue';
import { businessTravelSurvey } from './businessTravel/businessTravelSurvey';
import { BusinessTravelSurveyAnswerValue } from './businessTravel/businessTravelSurveyAnswerValue';

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
  [electricitySurvey.id]: electricitySurvey,
  [businessTravelSurvey.id]: businessTravelSurvey,
} as const;

export type SurveyToSurveyAnswerMap = {
  illumination: IlluminationSurveyAnswerValue;
  heating: HeatingSurveyAnswerValue;
  electricity: ElectricitySurveyAnswerValue;
  businessTravel: BusinessTravelSurveyAnswerValue;
};

export type KnownSurveyId = keyof SurveyToSurveyAnswerMap;
