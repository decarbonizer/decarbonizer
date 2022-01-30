import { useCalculation } from '../../../calculations/useCalculation';
import { useFilledActionAnswersDataFrame } from '../dashboardContext';
import { DashboardCardProps } from '../components/DashboardCard';
import range from 'lodash-es/range';
import ComparisonChartCard from '../components/ComparisonChartCard';
import { illuminationCoreCalculations } from '../../../calculations/core/illuminationCoreCalculations';

export default function FootprintComparisonChartCard(props: DashboardCardProps) {
  const filledActionAnswersDf = useFilledActionAnswersDataFrame();
  const { data, isLoading, error } = useCalculation(
    (externalCalculationData) => {
      const delta = illuminationCoreCalculations.getSummedYearlyFootprintDelta(
        externalCalculationData,
        externalCalculationData.surveyAnswers,
        filledActionAnswersDf,
      );

      return range(1, 11).map((year) => ({
        Year: year,
        'Old footprint': Math.round(year * delta.before),
        'New footprint': Math.round(year * delta.after),
      }));
    },
    [filledActionAnswersDf],
  );

  return (
    <ComparisonChartCard
      {...props}
      unit="kg"
      header="Footprint comparison over 10 years"
      data={data}
      isLoading={isLoading}
      error={error}
      syncId="illuminationFootprintComparison"
      oldDataKey="Old footprint"
      newDataKey="New footprint"
    />
  );
}
