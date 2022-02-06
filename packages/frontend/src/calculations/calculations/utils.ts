import { IDataFrame } from 'data-forge';
import { ActionPlan } from '../../api/actionPlan';
import { ChooseTimePeriodElementAnswerValue } from '../../data/actions/shared/chooseTimePeriodElement';

export function linearizeActionPlanAnswers(actionPlans: IDataFrame<number, ActionPlan>) {
  return actionPlans
    .flatMap((actionPlan) =>
      actionPlan.actionAnswers.map((answer) => {
        const detailsValue = (answer.values.detailsValue ?? {}) as ChooseTimePeriodElementAnswerValue;
        const startDate = new Date(detailsValue.chooseTimePeriod?.startDate ?? actionPlan.startDate);
        const endDate = new Date(detailsValue.chooseTimePeriod?.endDate ?? actionPlan.endDate);

        return {
          actionPlan,
          answer,
          startDate,
          endDate,
        };
      }),
    )
    .orderBy((x) => x.startDate)
    .thenBy((x) => x.endDate);
}
