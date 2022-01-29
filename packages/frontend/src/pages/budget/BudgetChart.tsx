import { Box, BoxProps } from '@chakra-ui/react';
import { DataFrame } from 'data-forge';
import {
  Area,
  Bar,
  Cell,
  ComposedChart,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ActionPlan } from '../../api/actionPlan';
import { useCalculation } from '../../calculations/useCalculation';
import { getBudgetChartData } from '../../calculations2/budget';

export type BudgetChartMode = 'cost' | 'co2';

export interface BudgetChartProps extends BoxProps {
  fromYear: number;
  toYear: number;
  actionPlans: Array<ActionPlan>;
  mode: BudgetChartMode;
}

export default function BudgetChart({ fromYear, toYear, actionPlans, mode, ...rest }: BudgetChartProps) {
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
          {mode === 'cost' && <YAxis width={100} domain={['auto', 'data-max']} unit="€" />}
          {mode === 'co2' && <YAxis yAxisId="co2" width={100} domain={['auto', 'data-max']} unit="kg" />}
          {/* <Bar dataKey="totalOriginalCost" name="Cost Without Action Plans" fill="#bAf6d4" unit="€" />
          <Bar dataKey="totalNewCost" name="Cost With Action Plans" fill="#9AE6B4" unit="€" />
          <Bar dataKey="delta" name="Cost Delta" opacity={0.6} fill="gray" unit="€" />
          <Line dataKey="accumulatedSavings" name="Savings" stroke="purple" unit="€" />
          <Line dataKey="totalNewInvestmentCosts" name="Maintenance Costs" stroke="red" unit="€" /> */}

          {mode === 'cost' && (
            <>
              <Bar dataKey="budget" stackId="cost" name="Budget" fill="#9AE6B477" unit="€">
                {(data ?? []).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.budget > 0 ? '#baf6d4' : '#fa8989'} />
                ))}
              </Bar>
              <ReferenceLine y={0} stroke="black" />
            </>
          )}
          {mode === 'co2' && (
            <Area
              yAxisId="co2"
              dataKey="footprint"
              name="Carbon Footprint"
              stroke="#9AE6B4"
              strokeWidth={3}
              fill="#9AE6B477"
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </Box>
  );
}
