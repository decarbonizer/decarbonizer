import { useCalculation } from '../../../calculations/useCalculation';
import { useFilledActionAnswersDataFrame } from '../dashboardContext';
import { DashboardCardProps } from '../components/DashboardCard';
import range from 'lodash-es/range';
import { getSurveyAnswersForSurvey } from '../../../calculationsLegacy/surveyAnswers/getSurveyAnswersForSurvey';
import ComparisonChartCard from '../components/ComparisonChartCard';
import {
  getElectricityFootprintPerYear,
  getTransformedElectricityFootprintPerYear,
} from '../../../calculationsLegacy/electricity/footprint';

export default function FootprintComparisonChartCard(props: DashboardCardProps) {
  const filledActionAnswersDf = useFilledActionAnswersDataFrame();
  const { data, isLoading, error } = useCalculation(
    (externalCalculationData) => {
      const electricitySurveyAnswers = getSurveyAnswersForSurvey(externalCalculationData.surveyAnswers, 'electricity');
      const oldFootprintPerYear = getElectricityFootprintPerYear(
        externalCalculationData,
        electricitySurveyAnswers.map((answer) => answer.value),
      );
      const newFootprintPerYear = getTransformedElectricityFootprintPerYear(
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
      unit="kg"
      header="Footprint comparison over 10 years"
      data={data}
      isLoading={isLoading}
      error={error}
      syncId="electricityFootprintComparison"
      oldDataKey="Old footprint"
      newDataKey="New footprint"
    />
  );
}
