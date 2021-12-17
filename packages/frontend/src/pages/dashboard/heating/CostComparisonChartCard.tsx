import { Series } from 'data-forge';
import range from 'lodash-es/range';
import { getSurveyAnswersForSurvey } from '../../../calculations/surveyAnswers/getSurveyAnswersForSurvey';
import { useCalculation } from '../../../calculations/useCalculation';
import { useFilledActionAnswersDataFrame } from '../dashboardContext';
import { DashboardCardProps } from '../components/DashboardCard';
import ComparisonChartCard from '../components/ComparisonChartCard';
import {
  getHeatingCostPerYear,
  getTransformedHeatingCostPerYear,
  getTransformedHeatingInstallationCostPerYear,
} from '../../../calculations/heating/cost';

export default function CostComparisonChartCard(props: DashboardCardProps) {
  const filledActionAnswersDf = useFilledActionAnswersDataFrame();
  const { data, isLoading, error } = useCalculation(
    (externalCalculationData) => {
      const heatingSurveyAnswers = getSurveyAnswersForSurvey(externalCalculationData.surveyAnswers, 'heating');
      const oldHeatingCostsPerYear = Math.round(
        getHeatingCostPerYear(
          externalCalculationData,
          heatingSurveyAnswers.map((answer) => answer.value),
        ),
      );
      const newHeatingCostsPerYear = Math.round(
        getTransformedHeatingCostPerYear(
          externalCalculationData,
          externalCalculationData.surveyAnswers,
          filledActionAnswersDf,
        ),
      );

      const years = new Series(range(1, 11));
      const oldMaintenanceCosts = years.map(() => 0);
      const newMaintenanceCosts = years.map((year) =>
        year === 1
          ? getTransformedHeatingInstallationCostPerYear(
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
      header="Cost comparison over 10 years"
      data={data}
      isLoading={isLoading}
      error={error}
      syncId="illuminationCostComparison"
      oldDataKey="Old costs"
      newDataKey="New costs"
    />
  );
}
