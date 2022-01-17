import { ExternalCalculationData } from '../externalData';
import range from 'lodash-es/range';
import { ActionPlan } from '../../api/actionPlan';
import { IDataFrame } from 'data-forge';
import { ChooseTimePeriodElementAnswerValue } from '../../data/actions/shared/chooseTimePeriodElement';
import { getIlluminationElectricityCostDelta } from '../illumination/electricityCost';
import { getHeatingCostDelta } from '../heating/cost';
import { getElectricityCostDelta } from '../electricity/cost';

export function getCostForYearRange(
  externalCalculationData: ExternalCalculationData,
  actionPlans: IDataFrame<number, ActionPlan>,
  fromYear: number,
  toYear: number,
) {
  const linearizedActionAnswers = actionPlans
    .flatMap((actionPlan) =>
      actionPlan.actionAnswers.map((answer) => {
        const detailsValue = (answer.values.detailsValue ?? {}) as ChooseTimePeriodElementAnswerValue;
        const startDate = new Date(detailsValue.timePeriod?.startDate ?? actionPlan.startDate);
        const endDate = new Date(detailsValue.timePeriod?.endDate ?? actionPlan.endDate);

        return {
          answer,
          startDate,
          endDate,
        };
      }),
    )
    .orderBy((x) => x.endDate)
    .thenBy((x) => x.startDate);

  return range(fromYear, toYear + 1).map((year) => {
    const activeActionAnswers = linearizedActionAnswers
      .where((x) => x.endDate.getFullYear() <= year)
      .map((x) => x.answer);

    const illuminationElectricityCosts = getIlluminationElectricityCostDelta(
      externalCalculationData,
      externalCalculationData.surveyAnswers,
      activeActionAnswers,
    );

    const heatingElectricityCosts = getHeatingCostDelta(
      externalCalculationData,
      externalCalculationData.surveyAnswers,
      activeActionAnswers,
    );

    const electricityCosts = getElectricityCostDelta(
      externalCalculationData,
      externalCalculationData.surveyAnswers,
      activeActionAnswers,
    );

    const totalOriginalCost =
      illuminationElectricityCosts.originalCost + heatingElectricityCosts.originalCost + electricityCosts.originalCost;

    const totalNewCost =
      illuminationElectricityCosts.costAfterActions +
      heatingElectricityCosts.costAfterActions +
      electricityCosts.costAfterActions;

    return {
      year,
      totalOriginalCost: totalOriginalCost.toFixed(0),
      totalNewCost: totalNewCost.toFixed(0),
      delta: (totalOriginalCost - totalNewCost).toFixed(0),
    };
  });
}
