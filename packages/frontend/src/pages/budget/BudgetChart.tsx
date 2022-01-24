import { Box, BoxProps } from '@chakra-ui/react';
import { DataFrame } from 'data-forge';
import { Bar, Cell, ComposedChart, Legend, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ActionPlan } from '../../api/actionPlan';
import { useCalculation } from '../../calculations/useCalculation';
import { getBudgetChartData } from '../../calculations2/budget';

export interface BudgetChartProps extends BoxProps {
  fromYear: number;
  toYear: number;
  actionPlans: Array<ActionPlan>;
}

export default function BudgetChart({ fromYear, toYear, actionPlans, ...rest }: BudgetChartProps) {
  const { data } = useCalculation(
    (externalCalculationData) =>
      getBudgetChartData(externalCalculationData, new DataFrame(actionPlans), fromYear, toYear),
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
          {/* <Bar dataKey="totalOriginalCost" name="Cost Without Action Plans" fill="#bAf6d4" unit="€" />
          <Bar dataKey="totalNewCost" name="Cost With Action Plans" fill="#9AE6B4" unit="€" />
          <Bar dataKey="delta" name="Cost Delta" opacity={0.6} fill="gray" unit="€" />
          <Line dataKey="accumulatedSavings" name="Savings" stroke="purple" unit="€" />
          <Line dataKey="totalNewInvestmentCosts" name="Maintenance Costs" stroke="red" unit="€" /> */}
          <Bar dataKey="budget" stackId="cost" name="Budget" fill="#bAf6d4" unit="€">
            {(data ?? []).map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.budget > 0 ? '#baf6d4' : '#fa8989'} />
            ))}
          </Bar>
          <ReferenceLine y={0} stroke="black" />
        </ComposedChart>
      </ResponsiveContainer>
    </Box>
  );
}
