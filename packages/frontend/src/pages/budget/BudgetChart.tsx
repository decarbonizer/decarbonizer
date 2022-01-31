import { Box, BoxProps, Center, Spinner } from '@chakra-ui/react';
import { useState } from 'react';
import {
  Area,
  Bar,
  Cell,
  ComposedChart,
  Legend,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ActionPlan } from '../../api/actionPlan';
import { BudgetChartDataEntry } from '../../calculations/calculations/getBudgetChartData';
import { useAsyncCalculation } from '../../calculations/useAsyncCalculation';
import BudgetChartDetailModal from './BudgetChartDetailModal';

export type BudgetChartMode = 'cost' | 'co2';

export interface BudgetChartProps extends BoxProps {
  fromYear: number;
  toYear: number;
  actionPlans: Array<ActionPlan>;
  mode: BudgetChartMode;
  showProfit: boolean;
}

export default function BudgetChart({ fromYear, toYear, actionPlans, mode, showProfit, ...rest }: BudgetChartProps) {
  const [dataEntry, setDataEntry] = useState<BudgetChartDataEntry | undefined>();
  const { isLoading, data } = useAsyncCalculation('getBudgetChartData', (_) => [actionPlans, fromYear, toYear], [
    fromYear,
    toYear,
    actionPlans,
  ]);

  const handleClick = (data) => {
    setDataEntry(data);
  };

  return (
    <Box w="100%" h="100%" pos="relative" {...rest}>
      {!isLoading && (
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data ?? []}>
            <Tooltip />
            <Legend />
            <XAxis dataKey="year" domain={[fromYear, toYear]} allowDataOverflow />
            {mode === 'cost' && <YAxis width={100} domain={['auto', 'data-max']} unit="€" />}
            {mode === 'co2' && <YAxis yAxisId="co2" width={100} domain={['auto', 'data-max']} unit="kg" />}
            {mode === 'cost' && (
              <>
                <Bar dataKey="budget" stackId="cost" name="Budget" fill="#9AE6B477" unit="€" onClick={handleClick}>
                  {(data ?? []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.budget > 0 ? '#baf6d4' : '#fa8989'} />
                  ))}
                </Bar>
                <ReferenceLine y={0} stroke="black" />
                {showProfit && <Line dataKey="profit" name="Profits" stroke="#F6E05E" unit="€" strokeWidth="3" />}
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
      )}
      {isLoading && (
        <Center pos="absolute" top={0} left={0} w="100%" h="100%">
          <Spinner color="primary.500" emptyColor="gray.200" size="xl" thickness="4px" />
        </Center>
      )}
      {dataEntry && <BudgetChartDetailModal isOpen onClose={() => setDataEntry(undefined)} data={dataEntry} />};
    </Box>
  );
}
