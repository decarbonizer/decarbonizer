import { DataFrame, IDataFrame } from 'data-forge';
import { ActionAnswerBase } from '../../api/actionAnswer';
import { SurveyAnswer } from '../../api/surveyAnswer';
import { getDeltaType } from '../../utils/deltaType';
import { ExternalCalculationData } from '../useExternalCalculationData';
import { getGlobalSummedYearlyFootprintDelta } from './getGlobalSummedYearlyFootprint';

export function getNetZero(
  externalCalculationData: ExternalCalculationData,
  surveyAnswers: IDataFrame<number, SurveyAnswer>,
  realEstateId: string,
  actionAnswers: IDataFrame<number, ActionAnswerBase>,
  actionPlanId?: string,
) {
  const surveyAnswersInitial = surveyAnswers.filter((surveyAnswer) => surveyAnswer.value.isInitialSurvey);
  const actionPlans = actionPlanId
    ? externalCalculationData.actionPlans.filter(
        (actionPlan) => actionPlan.realEstateId === realEstateId && actionPlan._id === actionPlanId,
      )
    : externalCalculationData.actionPlans.filter((actionPlan) => actionPlan.realEstateId === realEstateId);

  const netZeroSumActionPlan = actionPlans
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

  const footprintFilledActionAnswers = getGlobalSummedYearlyFootprintDelta(
    externalCalculationData,
    surveyAnswersInitial,
    actionAnswers,
  );

  const footprintFilledActionAnswersDelta =
    footprintFilledActionAnswers.delta <= 0
      ? Math.abs(footprintFilledActionAnswers.delta)
      : -Math.abs(footprintFilledActionAnswers.delta);

  const netZeroFilledActionAnswers = footprintFilledActionAnswersDelta / (footprintFilledActionAnswers.before / 100);

  const newAdjustedAchievedGoalFilledAction = netZeroFilledActionAnswers > 100 ? 100 : netZeroFilledActionAnswers;

  const newAdjustedAchievedGoal = netZeroSumActionPlan + newAdjustedAchievedGoalFilledAction;

  const netZeroDelta =
    footprintFilledActionAnswers.delta === 0 ? netZeroSumActionPlan : newAdjustedAchievedGoal - netZeroSumActionPlan;

  const deltaType = getDeltaType(netZeroDelta);

  return { newAdjustedAchievedGoal, deltaType };
}
