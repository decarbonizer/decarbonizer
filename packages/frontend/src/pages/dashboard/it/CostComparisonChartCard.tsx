import { Series } from 'data-forge';
import range from 'lodash-es/range';
import { getSurveyAnswersForSurvey } from '../../../calculations/surveyAnswers/getSurveyAnswersForSurvey';
import { useCalculation } from '../../../calculations/useCalculation';
import { useFilledActionAnswersDataFrame } from '../dashboardContext';
import { DashboardCardProps } from '../components/DashboardCard';
import ComparisonChartCard from '../components/ComparisonChartCard';
import { getItCostPerYear, getTransformedItCostPerYear } from '../../../calculations/it/cost';

export default function CostComparisonChartCard(props: DashboardCardProps) {
  const filledActionAnswersDf = useFilledActionAnswersDataFrame();
  const { data, isLoading, error } = useCalculation(
    (externalCalculationData) => {
      const itSurveyAnswers = getSurveyAnswersForSurvey(externalCalculationData.surveyAnswers, 'it');
      const oldCostsPerYear = Math.round(
        getItCostPerYear(
          externalCalculationData,
          itSurveyAnswers.map((answer) => answer.value),
        ),
      );
      const newCostsPerYear = Math.round(
        getTransformedItCostPerYear(
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
