import { Series } from 'data-forge';
import range from 'lodash-es/range';
import { useCalculation } from '../../../calculations/useCalculation';
import { useFilledActionAnswersDataFrame } from '../dashboardContext';
import { DashboardCardProps } from '../components/DashboardCard';
import ComparisonChartCard from '../components/ComparisonChartCard';
import { electricityCoreCalculations } from '../../../calculations/core/electricityCoreCalculations';

export default function CostComparisonChartCard(props: DashboardCardProps) {
  const filledActionAnswersDf = useFilledActionAnswersDataFrame();
  const { data, isLoading, error } = useCalculation(
    (externalCalculationData) => {
      const oldCostsPerYear = Math.round(
        electricityCoreCalculations.getTotalSummedYearlyConstantCosts(
          externalCalculationData,
          externalCalculationData.surveyAnswers,
        ),
      );
      const newCostsPerYear = Math.round(
        electricityCoreCalculations.getTotalSummedYearlyConstantCosts(
          externalCalculationData,
          externalCalculationData.surveyAnswers,
          filledActionAnswersDf,
        ),
      );

      const years = new Series(range(1, 11));
      return years
        .map((year) => ({
          Year: year,
          'Old costs': year * oldCostsPerYear,
          'New costs': year * newCostsPerYear,
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
      syncId="electricityCostComparison"
      oldDataKey="Old costs"
      newDataKey="New costs"
    />
  );
}
