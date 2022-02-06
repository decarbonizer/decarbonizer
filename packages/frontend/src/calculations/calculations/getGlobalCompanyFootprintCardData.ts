import { ExternalCalculationData } from '../useExternalCalculationData';
import { getGlobalSummedYearlyFootprint } from './getGlobalSummedYearlyFootprint';
import { linearizeActionPlanAnswers } from './utils';

export function getGlobalCompanyFootprintCardData(externalCalculationData: ExternalCalculationData) {
  return externalCalculationData.realEstates
    .map((realEstate) => {
      const surveyAnswers = externalCalculationData.surveyAnswers.filter((x) => x.realEstateId === realEstate._id);
      const actionAnswers = linearizeActionPlanAnswers(
        externalCalculationData.actionPlans.filter((x) => x.realEstateId === realEstate._id),
      ).map((x) => x.answer);
      return getGlobalSummedYearlyFootprint(externalCalculationData, surveyAnswers, actionAnswers);
    })
    .reduce((a, b) => a + b, 0);
}
