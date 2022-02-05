import { DataFrame } from 'data-forge';
import { ActionAnswerBase } from '../../api/actionAnswer';
import { SurveyAnswer } from '../../api/surveyAnswer';
import { ExternalCalculationData } from '../useExternalCalculationData';
import { getGlobalSummedYearlyFootprint } from './getGlobalSummedYearlyFootprint';
import { linearizeActionPlanAnswers } from './utils';

export function getRealEstateFootprintComparisonCardData(
  externalCalculationData: ExternalCalculationData,
  thisRealEstatesSurveyAnswers: Array<SurveyAnswer> | undefined,
  transformingActionAnswers: Array<ActionAnswerBase> | undefined,
  thisRealEstateId: string | undefined,
) {
  const transformingActionAnswersDf = new DataFrame(transformingActionAnswers ?? []);
  const thisRealEstatesSurveyAnswersDf = new DataFrame(thisRealEstatesSurveyAnswers ?? []);

  return externalCalculationData.realEstates
    .map((realEstate) => {
      const surveyAnswersToUse =
        realEstate._id === thisRealEstateId
          ? thisRealEstatesSurveyAnswersDf
          : externalCalculationData.surveyAnswers.filter((x) => x.realEstateId === realEstate._id);
      const transformingActionAnswersToUse =
        realEstate._id === thisRealEstateId
          ? transformingActionAnswersDf
          : linearizeActionPlanAnswers(
              externalCalculationData.actionPlans.filter((x) => x.realEstateId === realEstate._id),
            ).map((x) => x.answer);

      return {
        realEstate,
        footprint: Math.round(
          getGlobalSummedYearlyFootprint(externalCalculationData, surveyAnswersToUse, transformingActionAnswersToUse),
        ),
      };
    })
    .reduce((result, previous) => ({ ...result, [previous.realEstate.cityName]: previous.footprint }), {});
}
