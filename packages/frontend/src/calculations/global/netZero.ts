import { IDataFrame, DataFrame } from 'data-forge';
import { ActionAnswerBase } from '../../api/actionAnswer';
import { SurveyAnswer } from '../../api/surveyAnswer';
import { ExternalCalculationData } from '../externalData';
import { getFootprintDelta } from './footprint';

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
  const achievedGoalActionPlans =
    actionPlans.toArray().length === 0
      ? 0
      : actionPlans
          .map((actionPlan) => {
            const actionPlanFootprint = getFootprintDelta(
              externalCalculationData,
              surveyAnswersInitial,
              new DataFrame(actionPlan.actionAnswers),
            );

            const actionPlanDelta =
              actionPlanFootprint.delta < 0
                ? Math.abs(actionPlanFootprint.delta)
                : -Math.abs(actionPlanFootprint.delta);
            const actionPlanAchievedGoal = actionPlanDelta / (actionPlanFootprint.originalFootprint / 100);
            return actionPlanAchievedGoal;
          })
          .aggregate((a, b) => a + b);

  const footprintDelta = getFootprintDelta(externalCalculationData, surveyAnswersInitial, actionAnswers);

  const deltaType = footprintDelta.deltaType;
  const delta = footprintDelta.delta < 0 ? Math.abs(footprintDelta.delta) : -Math.abs(footprintDelta.delta);

  const newAchievedGoal = delta / (footprintDelta.originalFootprint / 100);
  const totalAchievedGoal = newAchievedGoal + achievedGoalActionPlans;
  const newAdjustedAchievedGoal = totalAchievedGoal > 100 ? 100 : totalAchievedGoal;

  return { achievedGoalActionPlans, newAchievedGoal, newAdjustedAchievedGoal, deltaType };
}
