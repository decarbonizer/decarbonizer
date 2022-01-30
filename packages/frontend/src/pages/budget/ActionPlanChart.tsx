import { Box, BoxProps } from '@chakra-ui/react';
import { useMemo } from 'react';
import { ResponsiveContainer, BarChart, Tooltip, XAxis, YAxis, Bar, LabelList, Cell } from 'recharts';
import { ActionPlan, ActionPlanStatus } from '../../api/actionPlan';

export interface ActionPlanChartProps extends BoxProps {
  fromYear: number;
  toYear: number;
  actionPlans: Array<ActionPlan>;
}

const actionPlanColors: Record<ActionPlanStatus, string> = {
  open: '#CBD5E0',
  inProgress: '#D6BCFA',
  finished: '#9AE6B4',
};

export default function ActionPlanChart({ fromYear, toYear, actionPlans, ...rest }: ActionPlanChartProps) {
  const data = useMemo(
    () =>
      actionPlans.map((actionPlan) => ({
        ...actionPlan,
        time: [
          // For a bar spanning two values recharts requires a tuple with the two values.
          new Date(actionPlan.startDate).getFullYear(),
          new Date(actionPlan.endDate).getFullYear(),
        ],
      })),
    [actionPlans],
  );

  return (
    <Box w="100%" h="100%" {...rest}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart layout="vertical" data={data ?? []} margin={{ left: 106 }}>
          <Tooltip />
          <XAxis type="number" dataKey="time" name="Time" domain={[fromYear, toYear]} allowDataOverflow hide />
          <YAxis type="category" dataKey="name" domain={['dataMin', 'dataMax']} hide />
          <Bar dataKey="time" maxBarSize={20} radius={1000}>
            {(data ?? []).map((entry, index) => (
              <Cell key={`cell-${index}`} fill={actionPlanColors[entry.status]} name="Foo" />
            ))}
            <LabelList dataKey="name" position="end" stroke="white" fill="white" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}
