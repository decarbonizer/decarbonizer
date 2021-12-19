import { useCalculation } from '../../../calculations/useCalculation';
import { useFilledActionAnswersDataFrame } from '../dashboardContext';
import { DashboardCardProps } from '../components/DashboardCard';
import range from 'lodash-es/range';
import { getSurveyAnswersForSurvey } from '../../../calculations/surveyAnswers/getSurveyAnswersForSurvey';
import ComparisonChartCard from '../components/ComparisonChartCard';
import {
  getHeatingFootprintPerYear,
  getTransformedHeatingFootprintPerYear,
} from '../../../calculations/heating/footprint';

export default function FootprintComparisonChartCard(props: DashboardCardProps) {
  const filledActionAnswersDf = useFilledActionAnswersDataFrame();
  const { data, isLoading, error } = useCalculation(
    (externalCalculationData) => {
      const heatingSurveyAnswers = getSurveyAnswersForSurvey(externalCalculationData.surveyAnswers, 'heating');
      const oldFootprintPerYear = getHeatingFootprintPerYear(
        externalCalculationData,
        heatingSurveyAnswers.map((answer) => answer.value),
      );
      const newFootprintPerYear = getTransformedHeatingFootprintPerYear(
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
      data={data}
      isLoading={isLoading}
      error={error}
      syncId="heatingFootprintComparison"
      oldDataKey="Old footprint"
      newDataKey="New footprint"
    />
  );
}