import { SkeletonText } from '@chakra-ui/react';
import { DataFrame, Series } from 'data-forge';
import range from 'lodash-es/range';
import { CartesianGrid, XAxis, YAxis, Tooltip, Area, AreaChart, Legend, ResponsiveContainer } from 'recharts';
import {
  getIlluminationElectricityCostPerYear,
  getTransformedIlluminationElectricityCostPerYear,
} from '../../../calculations/illumination/electricityCost';
import {
  getIlluminationMaintenanceCostForYear,
  getTransformedIlluminationMaintenanceCostForYear,
} from '../../../calculations/illumination/maintenanceCost';
import { getSurveyAnswersForSurvey } from '../../../calculations/surveyAnswers/getSurveyAnswersForSurvey';
import { useCalculation } from '../../../calculations/useCalculation';
import InlineErrorDisplay from '../../../components/InlineErrorDisplay';
import { useFilledActionAnswersDataFrame } from '../action-panel/actionPanelContext';
import DashboardCard, { DashboardCardProps } from '../components/DashboardCard';

export default function MaintenanceComparisonCard(props: DashboardCardProps) {
  const filledActionAnswersDf = useFilledActionAnswersDataFrame();
  const { data, isLoading, error } = useCalculation(
    (externalCalculationData) => {
      // const illuminationSurveyAnswers = getSurveyAnswersForSurvey(
      //   externalCalculationData.surveyAnswers,
      //   'illumination',
      // );
      // const oldElectricityCostsPerYear = getIlluminationElectricityCostPerYear(
      //   externalCalculationData,
      //   illuminationSurveyAnswers.map((answer) => answer.value),
      // );
      // const newElectricityCostsPerYear = getTransformedIlluminationElectricityCostPerYear(
      //   externalCalculationData,
      //   externalCalculationData.surveyAnswers,
      //   filledActionAnswersDf,
      // );

      // const years = new Series(range(1, 51));
      // const oldCostsPerYear = years.map((year) =>
      //   getIlluminationMaintenanceCostForYear(
      //     externalCalculationData,
      //     illuminationSurveyAnswers.map((answer) => answer.value),
      //     year,
      //   ),
      // );

      // const newCostsPerYear = years.map((year) =>
      //   getTransformedIlluminationMaintenanceCostForYear(
      //     externalCalculationData,
      //     illuminationSurveyAnswers,
      //     filledActionAnswersDf,
      //     year,
      //   ),
      // );

      // return years
      //   .map((year) => ({
      //     Year: year,
      //     'Old costs': Math.round(oldCostsPerYear.take(year).sum()),
      //     'New costs': Math.round(newCostsPerYear.take(year).sum()),
      //   }))
      //   .toArray();
      return [];
    },
    [filledActionAnswersDf],
  );

  return (
    <DashboardCard header="Compared maintenance costs over years" {...props}>
      <InlineErrorDisplay error={error}>
        {isLoading && <SkeletonText />}
        {data && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
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
              <Area type="monotone" dataKey="New costs" stroke="#B83280" strokeWidth={3} fill="transparent" />
              <Area type="monotone" dataKey="Old costs" stroke="#702459" strokeWidth={3} fill="transparent" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </InlineErrorDisplay>
    </DashboardCard>
  );
}
