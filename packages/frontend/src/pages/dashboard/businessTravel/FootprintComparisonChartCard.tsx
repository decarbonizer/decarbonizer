import { useCalculation } from '../../../calculations/useCalculation';
import { useFilledActionAnswersDataFrame } from '../dashboardContext';
import { DashboardCardProps } from '../components/DashboardCard';
import range from 'lodash-es/range';
import { getSurveyAnswersForSurvey } from '../../../calculationsLegacy/surveyAnswers/getSurveyAnswersForSurvey';
import ComparisonChartCard from '../components/ComparisonChartCard';
import {
  getBusinessTravelFootprintPerYear,
  getTransformedBusinessTravelFootprintPerYear,
} from '../../../calculationsLegacy/businessTravel/footprint';

export default function FootprintComparisonChartCard(props: DashboardCardProps) {
  const filledActionAnswersDf = useFilledActionAnswersDataFrame();
  const { data, isLoading, error } = useCalculation(
    (externalCalculationData) => {
      const businessTravelSurveyAnswers = getSurveyAnswersForSurvey(
        externalCalculationData.surveyAnswers,
        'businessTravel',
      );
      const oldFootprintPerYear = getBusinessTravelFootprintPerYear(
        externalCalculationData,
        businessTravelSurveyAnswers.map((answer) => answer.value),
      );
      const newFootprintPerYear = getTransformedBusinessTravelFootprintPerYear(
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
