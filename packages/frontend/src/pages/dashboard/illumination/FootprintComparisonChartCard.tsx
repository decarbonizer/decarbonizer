import {
  getIlluminationFootprintPerYear,
  getTransformedIlluminationFootprintPerYear,
} from '../../../calculations/illumination/footprint';
import { useCalculation } from '../../../calculations/useCalculation';
import { useFilledActionAnswersDataFrame } from '../dashboardContext';
import { DashboardCardProps } from '../components/DashboardCard';
import range from 'lodash-es/range';
import { getSurveyAnswersForSurvey } from '../../../calculations/surveyAnswers/getSurveyAnswersForSurvey';
import ComparisonChartCard from '../components/ComparisonChartCard';

export default function FootprintComparisonChartCard(props: DashboardCardProps) {
  const filledActionAnswersDf = useFilledActionAnswersDataFrame();
  const { data, isLoading, error } = useCalculation(
    (externalCalculationData) => {
      const illuminationSurveyAnswers = getSurveyAnswersForSurvey(
        externalCalculationData.surveyAnswers,
        'illumination',
      );
      const oldFootprintPerYear = getIlluminationFootprintPerYear(
        externalCalculationData,
        illuminationSurveyAnswers.map((answer) => answer.value),
      );
      const newFootprintPerYear = getTransformedIlluminationFootprintPerYear(
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
      syncId="illuminationFootprintComparison"
      oldDataKey="Old footprint"
      newDataKey="New footprint"
    />
  );
}
