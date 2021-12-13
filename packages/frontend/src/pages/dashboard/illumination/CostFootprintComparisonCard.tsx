import { SkeletonText } from '@chakra-ui/react';
import { CartesianGrid, XAxis, YAxis, Tooltip, Area, AreaChart, Legend, ResponsiveContainer } from 'recharts';
import {
  getIlluminationElectricityCostPerYear,
  getTransformedIlluminationElectricityCostPerYear,
} from '../../../calculations/illumination/electricityCost';
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

export default function CostFootprintComparisonCard(props: DashboardCardProps) {
  const filledActionAnswersDf = useFilledActionAnswersDataFrame();
  const { data, isLoading, error } = useCalculation(
    (externalCalculationData) => {
      const illuminationSurveyAnswers = getSurveyAnswersForSurvey(
        externalCalculationData.surveyAnswers,
        'illumination',
      );
      const oldElectricityCostsPerYear = getIlluminationElectricityCostPerYear(
        externalCalculationData,
        illuminationSurveyAnswers.map((answer) => answer.value),
      );
      const newElectricityCostsPerYear = getTransformedIlluminationElectricityCostPerYear(
        externalCalculationData,
        externalCalculationData.surveyAnswers,
        filledActionAnswersDf,
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
        'Old costs': year * oldElectricityCostsPerYear,
        'New costs': year * newElectricityCostsPerYear,
        'Old footprint': year * oldFootprintPerYear,
        'New footprint': year * newFootprintPerYear,
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
