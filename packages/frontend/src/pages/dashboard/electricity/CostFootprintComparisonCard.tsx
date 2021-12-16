import { SkeletonText } from '@chakra-ui/react';
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useCalculation } from '../../../calculations/useCalculation';
import InlineErrorDisplay from '../../../components/InlineErrorDisplay';
import { useFilledActionAnswersDataFrame } from '../dashboardContext';
import DashboardCard, { DashboardCardProps } from '../components/DashboardCard';
import range from 'lodash-es/range';
import { getSurveyAnswersForSurvey } from '../../../calculations/surveyAnswers/getSurveyAnswersForSurvey';
import {
  getElectricityCostPerYear,
  getTransformedElectricityCostPerYear,
} from '../../../calculations/electricity/cost';
import {
  getElectricityFootprintPerYear,
  getTransformedElectricityFootprintPerYear,
} from '../../../calculations/electricity/footprint';

export default function CostFootprintComparisonCard(props: DashboardCardProps) {
  const filledActionAnswersDf = useFilledActionAnswersDataFrame();
  const { data, isLoading, error } = useCalculation(
    (externalCalculationData) => {
      const electricitySurveyAnswers = getSurveyAnswersForSurvey(externalCalculationData.surveyAnswers, 'electricity');
      const oldElectricityCostsPerYear = getElectricityCostPerYear(
        externalCalculationData,
        electricitySurveyAnswers.map((answer) => answer.value),
      );
      const newElectricityCostsPerYear = getTransformedElectricityCostPerYear(
        externalCalculationData,
        externalCalculationData.surveyAnswers,
        filledActionAnswersDf,
      );
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
        'Old costs': Math.round(year * oldElectricityCostsPerYear),
        'New costs': Math.round(year * newElectricityCostsPerYear),
        'Old footprint': Math.round(year * oldFootprintPerYear),
        'New footprint': Math.round(year * newFootprintPerYear),
      }));
    },
    [filledActionAnswersDf],
  );

  return (
    <DashboardCard header="Compared costs and footprints over years" {...props}>
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
              <Legend />
              <Area type="monotone" dataKey="New footprint" stroke="#2F855A" strokeWidth={3} fill="transparent" />
              <Area type="monotone" dataKey="Old footprint" stroke="#68D391" strokeWidth={3} fill="transparent" />
              <Area type="monotone" dataKey="New costs" stroke="#B83280" strokeWidth={3} fill="transparent" />
              <Area type="monotone" dataKey="Old costs" stroke="#702459" strokeWidth={3} fill="transparent" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </InlineErrorDisplay>
    </DashboardCard>
  );
}
