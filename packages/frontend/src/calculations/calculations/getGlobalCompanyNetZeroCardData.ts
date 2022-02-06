// const { isLoading, data, error } = useCalculation((externalCalculationData) => {
//   const originalFootprint = externalCalculationData.realEstates
//     .map((realEstate) => {
//       const surveyAnswersInitital = externalCalculationData.surveyAnswers.filter(
//         (surveyAnswer) => surveyAnswer.realEstateId === realEstate._id,
//       );

import { DataFrame } from 'data-forge';
import { round } from 'lodash-es';
import { ActionAnswerBase } from '../../api/actionAnswer';
import { ExternalCalculationData } from '../useExternalCalculationData';
import { getGlobalCompanyFootprintCardData } from './getGlobalCompanyFootprintCardData';
import { getGlobalSummedYearlyFootprint } from './getGlobalSummedYearlyFootprint';

//       const originalFootprint = getGlobalSummedYearlyFootprint(externalCalculationData, surveyAnswersInitital);
//       return originalFootprint;
//     })
//     .reduce((a, b) => a + b, 0);

//   const realEstatesAfterActionPlans = externalCalculationData.realEstates.map((realEstate) =>
//     externalCalculationData.actionPlans.filter((actionPlan) => actionPlan.realEstateId === realEstate._id),
//   );

//   const footprintRealEstateActionPlans = realEstatesAfterActionPlans
//     .map((actionPlans) => {
//       const footPrintDeltaRealEstate = actionPlans
//         .map((actionPlan) => {
//           const surveyAnswersInitital = externalCalculationData.surveyAnswers.filter(
//             (surveyAnswer) =>
//               surveyAnswer.realEstateId === actionPlan.realEstateId && surveyAnswer.value.isInitialSurvey,
//           );
//           const footprintActionPlan = getGlobalSummedYearlyFootprintDelta(
//             externalCalculationData,
//             surveyAnswersInitital,
//             new DataFrame(actionPlan.actionAnswers),
//           ).delta;
//           return footprintActionPlan;
//         })
//         .reduce((a, b) => a + b, 0);
//       return footPrintDeltaRealEstate;
//     })
//     .reduce((a, b) => a + b, 0);

//   return { originalFootprint, footprintRealEstateActionPlans };
// });

// const delta = data ? data.footprintRealEstateActionPlans : 0;

// const deltaType = getDeltaType(delta);

// const deltaAbs = delta < 0 ? Math.abs(delta) : -Math.abs(delta);

// const newAchievedGoal = data?.originalFootprint ? deltaAbs / (data.originalFootprint / 100) : 0;

// const newAdjustedAchievedGoal = newAchievedGoal > 100 ? 100 : newAchievedGoal;

export function getGlobalCompanyNetZeroCardData(externalCalculationData: ExternalCalculationData) {
  const globalCompanyFootprintAfterActions = getGlobalCompanyFootprintCardData(externalCalculationData);
  const originalFootprintCompany = getGlobalSummedYearlyFootprint(
    externalCalculationData,
    externalCalculationData.surveyAnswers,
    new DataFrame<number, ActionAnswerBase>(),
  );

  const delta = round(originalFootprintCompany, 1) - round(globalCompanyFootprintAfterActions, 1);

  const netZero = round((delta / round(originalFootprintCompany, 1)) * 100, 1);

  return { netZeroAdjusted: Math.round(netZero) > 100 ? 100 : netZero };
}
