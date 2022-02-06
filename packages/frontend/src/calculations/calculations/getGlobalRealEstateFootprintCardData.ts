import { DataFrame } from 'data-forge';
import { ActionAnswerBase } from '../../api/actionAnswer';
import { SurveyAnswer } from '../../api/surveyAnswer';
import { ExternalCalculationData } from '../useExternalCalculationData';
import { getGlobalSummedYearlyFootprint } from './getGlobalSummedYearlyFootprint';

export function getGlobalRealEstateFootprintCardData(
  externalCalculationData: ExternalCalculationData,
  surveyAnswers: Array<SurveyAnswer>,
  actionAnswers: Array<ActionAnswerBase>,
) {
  return getGlobalSummedYearlyFootprint(
    externalCalculationData,
    new DataFrame(surveyAnswers),
    new DataFrame(actionAnswers),
  );
}
