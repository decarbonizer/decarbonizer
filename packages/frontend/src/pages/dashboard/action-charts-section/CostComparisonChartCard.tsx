import { Select, SkeletonText } from '@chakra-ui/react';
import { useState } from 'react';
import { useFilledActionAnswersDataFrame } from '../dashboardContext';
import DashboardCard, { DashboardCardProps } from '../components/DashboardCard';
import { useParams } from 'react-router';
import { RealEstatePageParams } from '../../../routes';
import { useAsyncCalculation } from '../../../calculations/useAsyncCalculation';
import { KnownCategoryCoreCalculationsId } from '../../../calculations/core/coreCalculations';
import { ResponsiveContainer, AreaChart, CartesianGrid, XAxis, YAxis, Legend, Area, Tooltip } from 'recharts';
import InlineErrorDisplay from '../../../components/InlineErrorDisplay';
import ComparisonChartTooltip from './ComparisonChartTooltip';

type CostCategory = 'all' | 'constant' | 'changing';

const dataKeys: Record<CostCategory, { before: string; after: string }> = {
  all: {
    before: 'totalCostsBefore',
    after: 'totalCostsAfter',
  },
  constant: {
    before: 'totalConstantCostsBefore',
    after: 'totalConstantCostsAfter',
  },
  changing: {
    before: 'totalChangingCostsBefore',
    after: 'totalChangingCostsAfter',
  },
};

export interface CostComparisonChartCardProps extends DashboardCardProps {
  coreCalculationsId: KnownCategoryCoreCalculationsId;
}

export default function CostComparisonChartCard({ coreCalculationsId, ...rest }: CostComparisonChartCardProps) {
  const { realEstateId } = useParams<RealEstatePageParams>();
  const filledActionAnswersDf = useFilledActionAnswersDataFrame();
  const { isLoading, data, error } = useAsyncCalculation(
    'getCostComparisonCardData',
    (externalCalculationData) => [
      coreCalculationsId,
      externalCalculationData.surveyAnswers.filter((x) => x.realEstateId === realEstateId).toArray(),
      filledActionAnswersDf.toArray(),
      11,
    ],
    [coreCalculationsId, filledActionAnswersDf, realEstateId],
  );
  const [selectedCostCategory, setSelectedCostCategory] = useState<CostCategory>('all');

  return (
    <DashboardCard
      headerControls={
        <Select
          size="sm"
          maxW="44"
          defaultValue="all"
          onChange={(e) => setSelectedCostCategory(e.target.value as CostCategory)}>
          <option value="all">All</option>
          <option value="constant">Recurring costs</option>
          <option value="changing">Maintenance cost</option>
        </Select>
      }
      header="Cost comparison over 10 years"
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
              <Tooltip content={ComparisonChartTooltip} formatter={(value, label) => [`${value}€`, label]} />
              <Legend />
              <Area
                type="monotone"
                dataKey={dataKeys[selectedCostCategory].before}
                name="Old costs"
                stroke="#9AE6B4"
                strokeWidth={3}
                fill="#9AE6B477"
              />
              <Area
                type="monotone"
                dataKey={dataKeys[selectedCostCategory].after}
                name="New costs"
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
