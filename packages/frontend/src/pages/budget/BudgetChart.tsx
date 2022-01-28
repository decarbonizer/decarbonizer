import { Box, BoxProps } from '@chakra-ui/react';
import { DataFrame } from 'data-forge';
import { Bar, ComposedChart, Legend, Line, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ActionPlan } from '../../api/actionPlan';
import { getCostForYearRange } from '../../calculations/global/cost';
import { useCalculation } from '../../calculations/useCalculation';

export interface BudgetChartProps extends BoxProps {
  fromYear: number;
  toYear: number;
  actionPlans: Array<ActionPlan>;
}

export default function BudgetChart({ fromYear, toYear, actionPlans, ...rest }: BudgetChartProps) {
  const { data } = useCalculation(
    (externalCalculationData) => {
      const costsForYear = getCostForYearRange(externalCalculationData, new DataFrame(actionPlans), fromYear, toYear);

      return costsForYear
        .select((costs, i) => ({
          ...costs,
          accumulatedSavings: costsForYear.take(i + 1).reduce((result, cost) => cost.delta + result, 0),
        }))
        .toArray();
    },
    [fromYear, toYear, actionPlans],
  );

  return (
    <Box w="100%" h="100%" {...rest}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data ?? []}>
          <Tooltip />
          <Legend />
          <XAxis dataKey="year" domain={[fromYear, toYear]} allowDataOverflow />
          <YAxis width={100} domain={['data-min', 'data-max']} unit="€" scale="linear" />
          <Bar dataKey="totalOriginalCost" name="Cost Without Action Plans" fill="#bAf6d4" unit="€" />
          <Bar dataKey="totalNewCost" name="Cost With Action Plans" fill="#9AE6B4" unit="€" />
          <Bar dataKey="delta" name="Cost Delta" opacity={0.6} fill="gray" unit="€" />
          <Line dataKey="accumulatedSavings" name="Savings" stroke="purple" unit="€" />
          <Line dataKey="totalNewInvestmentCosts" name="Maintenance Costs" stroke="red" unit="€" />
          <ReferenceLine y={0} stroke="black" />
        </ComposedChart>
      </ResponsiveContainer>
    </Box>
  );
}