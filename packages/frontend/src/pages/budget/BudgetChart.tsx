import { Box, BoxProps, Center, Spinner } from '@chakra-ui/react';
import { useMemo, useState } from 'react';
import {
  Area,
  Bar,
  CartesianGrid,
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

export interface BudgetChartConfig {
  fromYear: number;
  toYear: number;
  mode: BudgetChartMode;
  showGrid: boolean;
  showProfit: boolean;
  referenceBudget: number;
  showReferenceBudget: boolean;
}

export interface BudgetChartProps extends BoxProps {
  minYear: number;
  maxYear: number;
  actionPlans: Array<ActionPlan>;
  config: BudgetChartConfig;
}

export default function BudgetChart({
  minYear,
  maxYear,
  actionPlans,
  config: { fromYear, toYear, mode, showGrid, showProfit, referenceBudget, showReferenceBudget },
  ...rest
}: BudgetChartProps) {
  const [dataEntry, setDataEntry] = useState<BudgetChartDataEntry | undefined>();
  const { isLoading, data } = useAsyncCalculation('getBudgetChartData', () => [actionPlans, minYear, maxYear], [
    minYear,
    maxYear,
    actionPlans,
  ]);
  const filteredData = useMemo(
    () => (data ?? []).filter((x) => x.year >= fromYear && x.year <= toYear),
    [data, fromYear, toYear],
  );

  const handleClick = (data) => {
    setDataEntry(data);
  };

  return (
    <Box w="100%" h="100%" pos="relative" {...rest}>
      {!isLoading && (
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={filteredData}>
            <Tooltip />
            <Legend />
            {showGrid && <CartesianGrid />}
            <XAxis dataKey="year" allowDataOverflow />
            {mode === 'cost' && <YAxis width={100} domain={['auto', 'data-max']} unit="€" />}
            {mode === 'co2' && <YAxis yAxisId="co2" width={100} domain={['auto', 'data-max']} unit="kg" />}
            {mode === 'cost' && (
              <>
                <Bar dataKey="budget" stackId="cost" name="Budget" fill="#9AE6B477" unit="€" onClick={handleClick}>
                  {filteredData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.budget > 0 ? '#baf6d4' : '#fa8989'} />
                  ))}
                </Bar>
                <ReferenceLine y={0} stroke="black" />
                {showProfit && <Line dataKey="profit" name="Profits" stroke="#F6E05E" unit="€" strokeWidth="3" />}
                {showReferenceBudget && (
                  <ReferenceLine
                    y={-referenceBudget}
                    stroke="#E53E3E"
                    strokeWidth={2}
                    label={{ position: 'insideTopRight', value: 'Budget' }}
                  />
                )}
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
