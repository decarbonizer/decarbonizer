import { SkeletonText } from '@chakra-ui/react';
import { CartesianGrid, XAxis, YAxis, Tooltip, Area, AreaChart, Legend, ResponsiveContainer } from 'recharts';
import {
  getHeatingCostPerYear,
  getHeatingInstallationCostPerYear,
  getTransformedHeatingCostPerYear,
  getTransformedHeatingInstallationCostPerYear,
} from '../../../calculations/heating/cost';
import {
  getHeatingFootprintPerYear,
  getTransformedHeatingFootprintPerYear,
} from '../../../calculations/heating/footprint';
import { useCalculation } from '../../../calculations/useCalculation';
import InlineErrorDisplay from '../../../components/InlineErrorDisplay';
import { useFilledActionAnswersDataFrame } from '../action-panel/actionPanelContext';
import DashboardCard, { DashboardCardProps } from '../components/DashboardCard';
import range from 'lodash-es/range';
import { getSurveyAnswersForSurvey } from '../../../calculations/surveyAnswers/getSurveyAnswersForSurvey';

export default function CostFootprintComparisonCard(props: DashboardCardProps) {
  const filledActionAnswersDf = useFilledActionAnswersDataFrame();
  const { data, isLoading, error } = useCalculation(
    (externalCalculationData) => {
      const heatingSurveyAnswers = getSurveyAnswersForSurvey(externalCalculationData.surveyAnswers, 'heating');
      const oldHeatingCostsPerYear = getHeatingCostPerYear(
        externalCalculationData,
        heatingSurveyAnswers.map((answer) => answer.value),
      );
      const newHeatingCostsPerYear = getTransformedHeatingCostPerYear(
        externalCalculationData,
        externalCalculationData.surveyAnswers,
        filledActionAnswersDf,
      );
      const oldFootprintPerYear = getHeatingFootprintPerYear(
        externalCalculationData,
        heatingSurveyAnswers.map((answer) => answer.value),
      );
      const newFootprintPerYear = getTransformedHeatingFootprintPerYear(
        externalCalculationData,
        externalCalculationData.surveyAnswers,
        filledActionAnswersDf,
      );
      const oldInstallationCost = getHeatingInstallationCostPerYear(
        externalCalculationData,
        heatingSurveyAnswers.map((answer) => answer.value),
      );
      const newInstallationCost = getTransformedHeatingInstallationCostPerYear(
        externalCalculationData,
        externalCalculationData.surveyAnswers,
        filledActionAnswersDf,
      );

      return range(1, 11).map((year) => {
        if (year === 1) {
          return {
            Year: year,
            'Old costs': Math.round(oldHeatingCostsPerYear + oldInstallationCost),
            'New costs': Math.round(newHeatingCostsPerYear + newInstallationCost),
            'Old footprint': Math.round(oldFootprintPerYear),
            'New footprint': Math.round(newFootprintPerYear),
          };
        } else {
          return {
            Year: year,
            'Old costs': Math.round(year * oldHeatingCostsPerYear),
            'New costs': Math.round(year * newHeatingCostsPerYear),
            'Old footprint': Math.round(year * oldFootprintPerYear),
            'New footprint': Math.round(year * newFootprintPerYear),
          };
        }
      });
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
