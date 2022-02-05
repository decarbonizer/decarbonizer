import { ExternalCalculationData } from '../useExternalCalculationData';
import { getGlobalSummedYearlyFootprint } from './getGlobalSummedYearlyFootprint';
import { linearizeActionPlanAnswers } from './utils';

export function getCityCardData(externalCalculationData: ExternalCalculationData, realEstateId: string) {
  const surveyAnswers = externalCalculationData.surveyAnswers.filter(
    (surveyAnswer) => surveyAnswer.realEstateId === realEstateId,
  );
  const actionAnswers = linearizeActionPlanAnswers(
    externalCalculationData.actionPlans.filter((actionPlan) => actionPlan.realEstateId === realEstateId),
  ).map((x) => x.answer);
  const footprint = getGlobalSummedYearlyFootprint(externalCalculationData, surveyAnswers, actionAnswers);

  return {
    footprint,
  };
}
