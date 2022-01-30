import { Series } from 'data-forge';
import range from 'lodash-es/range';
import { useCalculation } from '../../../calculations/useCalculation';
import { useFilledActionAnswersDataFrame } from '../dashboardContext';
import { DashboardCardProps } from '../components/DashboardCard';
import ComparisonChartCard from '../components/ComparisonChartCard';
import { heatingCoreCalculations } from '../../../calculations/core/heatingCoreCalculations';

export default function CostComparisonChartCard(props: DashboardCardProps) {
  const filledActionAnswersDf = useFilledActionAnswersDataFrame();
  const { data, isLoading, error } = useCalculation(
    (externalCalculationData) => {
      const oldHeatingCostsPerYear = Math.round(
        heatingCoreCalculations.getTotalSummedYearlyConstantCosts(
          externalCalculationData,
          externalCalculationData.surveyAnswers,
        ),
      );
      const newHeatingCostsPerYear = Math.round(
        heatingCoreCalculations.getTotalSummedYearlyConstantCosts(
          externalCalculationData,
          externalCalculationData.surveyAnswers,
          filledActionAnswersDf,
        ),
      );

      const years = new Series(range(1, 11));
      const oldMaintenanceCosts = years.map(() => 0);
      const newMaintenanceCosts = years.map((year) =>
        year === 1 && oldHeatingCostsPerYear !== newHeatingCostsPerYear
          ? heatingCoreCalculations.getTotalSummedInvestmentCosts(
              externalCalculationData,
              externalCalculationData.surveyAnswers,
              filledActionAnswersDf,
            )
          : 0,
      );

      const oldCostsPerYear = oldMaintenanceCosts.map((maintenanceCost) => maintenanceCost + oldHeatingCostsPerYear);
      const newCostsPerYear = newMaintenanceCosts.map((maintenanceCost) => maintenanceCost + newHeatingCostsPerYear);

      return years
        .map((year) => ({
          Year: year,
          'Old costs': oldCostsPerYear.take(year).sum(),
          'New costs': newCostsPerYear.take(year).sum(),
        }))
        .toArray();
    },
    [filledActionAnswersDf],
  );

  return (
    <ComparisonChartCard
      {...props}
      unit="€"
      header="Cost comparison over 10 years"
      data={data}
      isLoading={isLoading}
      error={error}
      syncId="heatingCostComparison"
      oldDataKey="Old costs"
      newDataKey="New costs"
    />
  );
}
