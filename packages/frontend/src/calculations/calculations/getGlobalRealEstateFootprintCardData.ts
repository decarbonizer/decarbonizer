// const { isLoading, data, error } = useCalculation(
//   (externalCalculationData) => {
//     const surveyAnswers = externalCalculationData.surveyAnswers.filter(
//       (surveyAnswer) => surveyAnswer.realEstateId === realEstateId && surveyAnswer.value.isInitialSurvey,
//     );
//     const actionPlansRealEstate = externalCalculationData.actionPlans.filter(
//       (actionPlan) => actionPlan.realEstateId === realEstateId,
//     );
//     const originalFootprint = getGlobalSummedYearlyFootprint(externalCalculationData, surveyAnswers);

import { DataFrame } from 'data-forge';
import { ActionAnswerBase } from '../../api/actionAnswer';
import { SurveyAnswer } from '../../api/surveyAnswer';
import { ExternalCalculationData } from '../useExternalCalculationData';
import { getGlobalSummedYearlyFootprint } from './getGlobalSummedYearlyFootprint';

//     const actionPlanFootprints = actionPlansRealEstate
//       .map((actionPlan) => {
//         const footprintActionPlan = getGlobalSummedYearlyFootprintDelta(
//           externalCalculationData,
//           surveyAnswers,
//           new DataFrame(actionPlan.actionAnswers),
//         ).delta;
//         return footprintActionPlan;
//       })
//       .reduce((a, b) => a + b, 0);

//     const footprintAction = getGlobalSummedYearlyFootprintDelta(
//       externalCalculationData,
//       surveyAnswers,
//       filledActionAnswersDf,
//     ).delta;

//     const overallFootprint = originalFootprint + footprintAction + actionPlanFootprints;

//     return {
//       overallFootprint,
//     };
//   },
//   [filledActionAnswersDf],
// );

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
