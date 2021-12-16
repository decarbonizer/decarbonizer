import { Select, SkeletonText } from '@chakra-ui/react';
import { DataFrame, Series } from 'data-forge';
import range from 'lodash-es/range';
import { useState } from 'react';
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

export default function CostComparisonChartCard(props: DashboardCardProps) {
  const filledActionAnswersDf = useFilledActionAnswersDataFrame();
  const { data, isLoading, error } = useCalculation(
    (externalCalculationData) => {
      const illuminationSurveyAnswers = getSurveyAnswersForSurvey(
        externalCalculationData.surveyAnswers,
        'illumination',
      );
      const oldElectricityCostsPerYear = Math.round(
        getIlluminationElectricityCostPerYear(
          externalCalculationData,
          illuminationSurveyAnswers.map((answer) => answer.value),
        ),
      );
      const newElectricityCostsPerYear = Math.round(
        getTransformedIlluminationElectricityCostPerYear(
          externalCalculationData,
          externalCalculationData.surveyAnswers,
          filledActionAnswersDf,
        ),
      );

      const years = new Series(range(1, 11));
      const oldMaintenanceCosts = years.map((year) =>
        Math.round(
          getIlluminationMaintenanceCostForYear(
            externalCalculationData,
            illuminationSurveyAnswers.map((answer) => answer.value),
            year,
          ).maintenanceCostThisYear,
        ),
      );
      const newMaintenanceCosts = years.map((year) =>
        Math.round(
          year === 1
            ? getTransformedIlluminationMaintenanceCostForYear(
                externalCalculationData,
                illuminationSurveyAnswers,
                filledActionAnswersDf,
                year,
              ).costOnReplace
            : 0 +
                getTransformedIlluminationMaintenanceCostForYear(
                  externalCalculationData,
                  illuminationSurveyAnswers,
                  filledActionAnswersDf,
                  year,
                ).maintenanceCostThisYear,
        ),
      );
      const oldCostsPerYear = oldMaintenanceCosts.map(
        (maintenanceCost) => maintenanceCost + oldElectricityCostsPerYear,
      );
      const newCostsPerYear = newMaintenanceCosts.map(
        (maintenanceCost) => maintenanceCost + newElectricityCostsPerYear,
      );

      return years
        .map((year) => ({
          Year: year,
          'Old costs': oldCostsPerYear.take(year).sum(),
          'New costs': newCostsPerYear.take(year).sum(),
          'Old maintenance costs': oldMaintenanceCosts.take(year).sum(),
          'New maintenance costs': newMaintenanceCosts.take(year).sum(),
          'Old electricity costs': oldElectricityCostsPerYear * year,
          'New electricity costs': newElectricityCostsPerYear * year,
        }))
        .toArray();
    },
    [filledActionAnswersDf],
  );
  const [selectedCostCategory, setSelectedCostCategory] = useState('all');

  return (
    <DashboardCard
      header="Cost comparison over 10 years"
      isExpandable
      headerControls={
        <Select size="sm" maxW="40" defaultValue="all" onChange={(e) => setSelectedCostCategory(e.target.value)}>
          <option value="all">All</option>
          <option value="electricity">Electricity</option>
          <option value="maintenance">Maintenance</option>
        </Select>
      }
      {...props}>
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
              {selectedCostCategory === 'all' && (
                <>
                  <Area type="monotone" dataKey="New costs" stroke="#9AE6B4" strokeWidth={3} fill="#9AE6B477" />
                  <Area type="monotone" dataKey="Old costs" stroke="#B794F4" strokeWidth={3} fill="#B794F477" />
                </>
              )}
              {selectedCostCategory === 'electricity' && (
                <>
                  <Area
                    type="monotone"
                    dataKey="New electricity costs"
                    stroke="#9AE6B4"
                    strokeWidth={3}
                    fill="#9AE6B477"
                  />
                  <Area
                    type="monotone"
                    dataKey="Old electricity costs"
                    stroke="#B794F4"
                    strokeWidth={3}
                    fill="#B794F477"
                  />
                </>
              )}
              {selectedCostCategory === 'maintenance' && (
                <>
                  <Area
                    type="monotone"
                    dataKey="New maintenance costs"
                    stroke="#9AE6B4"
                    strokeWidth={3}
                    fill="#9AE6B477"
                  />
                  <Area
                    type="monotone"
                    dataKey="Old maintenance costss"
                    stroke="#B794F4"
                    strokeWidth={3}
                    fill="#B794F477"
                  />
                </>
              )}
            </AreaChart>
          </ResponsiveContainer>
        )}
      </InlineErrorDisplay>
    </DashboardCard>
  );
}
