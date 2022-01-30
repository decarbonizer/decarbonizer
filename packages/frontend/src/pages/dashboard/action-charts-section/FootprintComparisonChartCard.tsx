import { useFilledActionAnswersDataFrame } from '../dashboardContext';
import DashboardCard, { DashboardCardProps } from '../components/DashboardCard';
import { KnownCategoryCoreCalculationsId } from '../../../calculations/core/coreCalculations';
import { SkeletonText } from '@chakra-ui/react';
import { ResponsiveContainer, AreaChart, CartesianGrid, XAxis, YAxis, Legend, Area, Tooltip } from 'recharts';
import InlineErrorDisplay from '../../../components/InlineErrorDisplay';
import { useAsyncCalculation } from '../../../calculations/useAsyncCalculation';
import ComparisonChartTooltip from './ComparisonChartTooltip';
import { useParams } from 'react-router';
import { RealEstatePageParams } from '../../../routes';

export interface FootprintComparisonChartCardProps extends DashboardCardProps {
  coreCalculationsId: KnownCategoryCoreCalculationsId;
}

export default function FootprintComparisonChartCard({
  coreCalculationsId,
  ...rest
}: FootprintComparisonChartCardProps) {
  const { realEstateId } = useParams<RealEstatePageParams>();
  const filledActionAnswersDf = useFilledActionAnswersDataFrame();
  const { isLoading, data, error } = useAsyncCalculation(
    'getFootprintComparisonCardData',
    (externalCalculationData) => [
      coreCalculationsId,
      externalCalculationData.surveyAnswers.filter((x) => x.realEstateId === realEstateId).toArray(),
      filledActionAnswersDf.toArray(),
      11,
    ],
    [coreCalculationsId, filledActionAnswersDf, realEstateId],
  );

  return (
    <DashboardCard
      header="Footprint comparison over 10 years"
      isExpandable
      showRevalidatingSpinner={isLoading}
      {...rest}>
      <InlineErrorDisplay error={error}>
        {!data && <SkeletonText />}
        {data && (
          <ResponsiveContainer width="100%" height="100%" minHeight={200}>
            <AreaChart
              data={data}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 15,
              }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" label={{ value: 'Years', position: 'insideBottomRight', offset: -10 }} />
              <YAxis />
              <Tooltip content={ComparisonChartTooltip} formatter={(value, label) => [`${value}kg`, label]} />
              <Legend />
              <Area
                type="monotone"
                dataKey="before"
                name="Old footprint"
                stroke="#9AE6B4"
                strokeWidth={3}
                fill="#9AE6B477"
              />
              <Area
                type="monotone"
                dataKey="after"
                name="New footprint"
                stroke="#B794F4"
                strokeWidth={3}
                fill="#B794F477"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </InlineErrorDisplay>
    </DashboardCard>
  );
}
