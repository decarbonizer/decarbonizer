import { DataFrame, IDataFrame } from 'data-forge';
import { ActionAnswerBase } from '../../api/actionAnswer';
import { SurveyAnswer } from '../../api/surveyAnswer';
import { getDeltaType } from '../../utils/deltaType';
import { ExternalCalculationData } from '../useExternalCalculationData';
import { getGlobalSummedYearlyFootprintDelta } from './getGlobalSummedYearlyFootprint';

export function getNetZero(
  externalCalculationData: ExternalCalculationData,
  surveyAnswers: IDataFrame<number, SurveyAnswer>,
  actionAnswers: IDataFrame<number, ActionAnswerBase>,
  realEstateId: string,
) {
  const surveyAnswersInitial = surveyAnswers.filter((surveyAnswer) => surveyAnswer.value.isInitialSurvey);
  const actionPlans = externalCalculationData.actionPlans.filter(
    (actionPlan) => actionPlan.realEstateId === realEstateId,
  );
  const netZeroSum = actionPlans
    .map((actionPlan) => {
      const footprintDelta = getGlobalSummedYearlyFootprintDelta(
        externalCalculationData,
        surveyAnswersInitial,
        new DataFrame(actionPlan.actionAnswers),
      );
      const delta = footprintDelta.delta < 0 ? Math.abs(footprintDelta.delta) : -Math.abs(footprintDelta.delta);
      const newAchievedGoal = delta / (footprintDelta.before / 100);

      return newAchievedGoal;
    })
    .reduce((a, b) => a + b, 0);

  const deltaType = getDeltaType(netZeroSum);

  const newAdjustedAchievedGoal = netZeroSum > 100 ? 100 : netZeroSum;

  return { netZeroSum, newAdjustedAchievedGoal, deltaType };
}
