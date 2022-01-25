import { Box, BoxProps } from '@chakra-ui/react';
import { useMemo } from 'react';
import { ResponsiveContainer, BarChart, Tooltip, XAxis, YAxis, Bar, LabelList } from 'recharts';
import { ActionPlan } from '../../api/actionPlan';

export interface ActionPlanChartProps extends BoxProps {
  fromYear: number;
  toYear: number;
  actionPlans: Array<ActionPlan>;
}

export default function ActionPlanChart({ fromYear, toYear, actionPlans, ...rest }: ActionPlanChartProps) {
  const data = useMemo(
    () =>
      actionPlans.map((x) => ({
        name: x.name,
        time: [
          // For a bar spanning two values recharts requires a tuple with the two values.
          new Date(x.startDate).getFullYear(),
          new Date(x.endDate).getFullYear(),
        ],
      })),
    [actionPlans],
  );

  return (
    <Box w="100%" h="100%" {...rest}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart layout="vertical" data={data ?? []} margin={{ left: 106 }}>
          <Tooltip />
          <XAxis type="number" dataKey="time" domain={[fromYear, toYear]} allowDataOverflow hide />
          <YAxis type="category" dataKey="name" domain={['dataMin', 'dataMax']} hide />
          <Bar dataKey="time" fill="cornflowerblue" maxBarSize={20}>
            <LabelList dataKey="name" position="center" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}
