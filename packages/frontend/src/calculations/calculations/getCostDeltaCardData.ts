import { DataFrame } from 'data-forge';
import { ActionAnswerBase } from '../../api/actionAnswer';
import { SurveyAnswer } from '../../api/surveyAnswer';
import { categoryCoreCalculationsMap, KnownCategoryCoreCalculationsId } from '../core/coreCalculations';
import { ExternalCalculationData } from '../useExternalCalculationData';

export function getCostDeltaCardData(
  externalCalculationData: ExternalCalculationData,
  category: KnownCategoryCoreCalculationsId,
  surveyAnswers: Array<SurveyAnswer>,
  transformingActionAnswers: Array<ActionAnswerBase>,
) {
  const surveyAnswersDf = new DataFrame(surveyAnswers);
  const transformingActionAnswersDf = new DataFrame(transformingActionAnswers);
  const coreCalculations = categoryCoreCalculationsMap[category];

  const yearlyConstantCostsDelta = coreCalculations.getTotalSummedYearlyConstantCostsDelta(
    externalCalculationData,
    surveyAnswersDf,
    transformingActionAnswersDf,
  );

  return {
    yearlyConstantCostsDelta,
  };
}
