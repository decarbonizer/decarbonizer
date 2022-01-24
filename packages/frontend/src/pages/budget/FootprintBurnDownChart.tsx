import { Box, BoxProps } from '@chakra-ui/react';
import { DataFrame } from 'data-forge';
import { ResponsiveContainer, LineChart, Legend, XAxis, YAxis, Line, Tooltip } from 'recharts';
import { ActionPlan } from '../../api/actionPlan';
import { getFootprintForYearRange } from '../../calculations/global/footprint';
import { useCalculation } from '../../calculations/useCalculation';

export interface FootprintBurnDownChartProps extends BoxProps {
  fromYear: number;
  toYear: number;
  actionPlans: Array<ActionPlan>;
}

export default function FootprintBurnDownChart({
  fromYear,
  toYear,
  actionPlans,
  ...rest
}: FootprintBurnDownChartProps) {
  const { data } = useCalculation(
    (externalCalculationData) => {
      return getFootprintForYearRange(
        externalCalculationData,
        externalCalculationData.surveyAnswers,
        new DataFrame(actionPlans),
        fromYear,
        toYear,
      );
    },
    [fromYear, toYear, actionPlans],
  );

  return (
    <Box w="100%" h="100%" {...rest}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data ?? []}>
          <Tooltip />
          <Legend />
          <XAxis dataKey="year" domain={[fromYear, toYear]} allowDataOverflow />
          <YAxis width={100} unit=" CO²" scale="linear" />
          <Line type="step" dataKey="footprint" stroke="#82ca9d" activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
}
