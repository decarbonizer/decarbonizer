import { ExternalCalculationData } from '../externalData';
import range from 'lodash-es/range';
import { ActionPlan } from '../../api/actionPlan';
import { DataFrame, IDataFrame } from 'data-forge';
import { ChooseTimePeriodElementAnswerValue } from '../../data/actions/shared/chooseTimePeriodElement';
import { getIlluminationElectricityCostDelta } from '../illumination/electricityCost';
import { getHeatingCostDelta, getTransformedHeatingInstallationCostPerYear } from '../heating/cost';
import { getElectricityCostDelta } from '../electricity/cost';
import {
  getIlluminationMaintenanceCostForYear,
  getTransformedIlluminationMaintenanceCostForYear,
} from '../illumination/maintenanceCost';

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
    .orderBy((x) => x.startDate)
    .thenBy((x) => x.endDate);

  return new DataFrame(range(fromYear, toYear + 1)).map((year) => {
    const normalizedYear = year - fromYear + 1;
    const activeActionAnswers = linearizedActionAnswers
      .where((x) => x.startDate.getFullYear() <= year)
      .map((x) => x.answer);
    const newActionAnswersThisYear = linearizedActionAnswers
      .where((x) => x.startDate.getFullYear() === year)
      .map((x) => x.answer);

    const illuminationElectricityCosts = getIlluminationElectricityCostDelta(
      externalCalculationData,
      externalCalculationData.surveyAnswers,
      activeActionAnswers,
    );

    const originalIlluminationMaintenanceCosts = getTransformedIlluminationMaintenanceCostForYear(
      externalCalculationData,
      externalCalculationData.surveyAnswers,
      new DataFrame(),
      normalizedYear,
    );

    const newIlluminationMaintenanceCosts = getTransformedIlluminationMaintenanceCostForYear(
      externalCalculationData,
      externalCalculationData.surveyAnswers,
      activeActionAnswers,
      normalizedYear,
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

    const totalOriginalInvestmentCosts = originalIlluminationMaintenanceCosts.maintenanceCostThisYear;

    const totalNewInvestmentCosts = newIlluminationMaintenanceCosts.maintenanceCostThisYear;

    return {
      year,
      totalOriginalInvestmentCosts: Math.round(totalOriginalInvestmentCosts),
      totalNewInvestmentCosts: Math.round(totalNewInvestmentCosts),
      totalOriginalCost: Math.round(totalOriginalCost),
      totalNewCost: Math.round(totalNewCost),
      delta: Math.round(totalOriginalCost - totalNewCost),
    };
  });
}
