import { Box, BoxProps } from '@chakra-ui/react';
import { useParams } from 'react-router';
import { Bar, BarChart, Legend, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
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
    <Box w="100%" h="100%" {...rest}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data ?? []}>
          <Tooltip />
          <Legend />
          <XAxis dataKey="year" domain={[fromYear, toYear]} allowDataOverflow />
          <YAxis width={100} domain={['data-min', 'data-max']} unit="€" scale="linear" />
          <Bar dataKey="totalOriginalCost" name="Cost Without Action Plans" fill="#bAf6d4" unit="€" />
          <Bar dataKey="totalNewCost" name="Cost With Action Plans" fill="#9AE6B4" unit="€" />
          <Bar dataKey="delta" name="Cost Delta" opacity={0.6} fill="gray" unit="€" />
          <ReferenceLine y={0} stroke="black" />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}
