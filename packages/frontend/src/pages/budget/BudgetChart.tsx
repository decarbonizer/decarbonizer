import { Box, BoxProps } from '@chakra-ui/react';
import { useParams } from 'react-router';
import { Bar, BarChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { getCostForYearRange } from '../../calculations/global/cost';
import { useCalculation } from '../../calculations/useCalculation';
import { RealEstatePageParams } from '../../routes';

export interface BudgetChartProps extends BoxProps {
  fromYear: number;
  toYear: number;
}

export default function BudgetChart({ fromYear, toYear, ...rest }: BudgetChartProps) {
  const { realEstateId } = useParams<RealEstatePageParams>();
  const { data } = useCalculation(
    (externalCalculationData) => {
      const actionPlans = externalCalculationData.actionPlans.where((x) => x.realEstateId === realEstateId);
      return getCostForYearRange(externalCalculationData, actionPlans, fromYear, toYear);
    },
    [fromYear, toYear, realEstateId],
  );

  return (
    <Box {...rest}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data ?? []}>
          <Tooltip />
          <XAxis dataKey="year" domain={[fromYear, toYear]} allowDataOverflow />
          <YAxis width={100} unit="€" />
          <Bar dataKey="totalOriginalCost" opacity={0.6} fill="red" unit="€" />
          <Bar dataKey="totalNewCost" opacity={0.6} fill="green" unit="€" />
          <Bar dataKey="delta" opacity={0.6} fill="gray" unit="€" />
          <ReferenceLine y={0} stroke="black" />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}
