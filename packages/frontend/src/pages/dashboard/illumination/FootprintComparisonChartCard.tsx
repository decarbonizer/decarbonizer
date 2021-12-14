import { SkeletonText } from '@chakra-ui/react';
import { CartesianGrid, XAxis, YAxis, Tooltip, Area, AreaChart, Legend, ResponsiveContainer } from 'recharts';
import {
  getIlluminationFootprintPerYear,
  getTransformedIlluminationFootprintPerYear,
} from '../../../calculations/illumination/footprint';
import { useCalculation } from '../../../calculations/useCalculation';
import InlineErrorDisplay from '../../../components/InlineErrorDisplay';
import { useFilledActionAnswersDataFrame } from '../action-panel/actionPanelContext';
import DashboardCard, { DashboardCardProps } from '../components/DashboardCard';
import range from 'lodash-es/range';
import { getSurveyAnswersForSurvey } from '../../../calculations/surveyAnswers/getSurveyAnswersForSurvey';

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
    <DashboardCard header="Footprint comparison over 10 years" isExpandable {...props}>
      <InlineErrorDisplay error={error}>
        {isLoading && <SkeletonText />}
        {data && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              syncId="compareData"
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 15,
              }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="Year" label={{ value: 'Years', position: 'insideBottomRight', offset: -10 }} />
              <YAxis />
              <Tooltip />
              <Legend margin={{ top: 10 }} offset={-10} />
              <Area type="monotone" dataKey="New footprint" stroke="#9AE6B4" strokeWidth={3} fill="#9AE6B477" />
              <Area type="monotone" dataKey="Old footprint" stroke="#B794F4" strokeWidth={3} fill="#B794F477" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </InlineErrorDisplay>
    </DashboardCard>
  );
}
