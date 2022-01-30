import { useCalculation } from '../../../calculations/useCalculation';
import { useFilledActionAnswersDataFrame } from '../dashboardContext';
import { DashboardCardProps } from '../components/DashboardCard';
import range from 'lodash-es/range';
import ComparisonChartCard from '../components/ComparisonChartCard';
import { businessTravelCoreCalculations } from '../../../calculations/core/businessTravelCoreCalculations';

export default function FootprintComparisonChartCard(props: DashboardCardProps) {
  const filledActionAnswersDf = useFilledActionAnswersDataFrame();
  const { data, isLoading, error } = useCalculation(
    (externalCalculationData) => {
      const oldFootprintPerYear = businessTravelCoreCalculations.getSummedYearlyFootprint(
        externalCalculationData,
        externalCalculationData.surveyAnswers,
      );
      const newFootprintPerYear = businessTravelCoreCalculations.getSummedYearlyFootprint(
        externalCalculationData,
        externalCalculationData.surveyAnswers,
        filledActionAnswersDf,
      );

      return range(1, 11).map((year) => ({
        Year: year,
        'Old footprint': Math.round(year * oldFootprintPerYear),
        'New footprint': Math.round(year * newFootprintPerYear),
      }));
    },
    [filledActionAnswersDf],
  );

  return (
    <ComparisonChartCard
      {...props}
      header="Footprint comparison over 10 years"
      unit="kg"
      data={data}
      isLoading={isLoading}
      error={error}
      syncId="businessTravelFootprintComparison"
      oldDataKey="Old footprint"
      newDataKey="New footprint"
    />
  );
}
