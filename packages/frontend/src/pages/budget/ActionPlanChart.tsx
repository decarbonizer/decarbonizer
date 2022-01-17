import { Box, BoxProps } from '@chakra-ui/react';
import { useParams } from 'react-router';
import { ResponsiveContainer, BarChart, Tooltip, XAxis, YAxis, Bar, LabelList } from 'recharts';
import { useCalculation } from '../../calculations/useCalculation';
import { RealEstatePageParams } from '../../routes';

export interface ActionPlanChartProps extends BoxProps {
  fromYear: number;
  toYear: number;
}

export default function ActionPlanChart({ fromYear, toYear, ...rest }: ActionPlanChartProps) {
  const { realEstateId } = useParams<RealEstatePageParams>();
  const { data } = useCalculation(
    ({ actionPlans }) =>
      actionPlans
        .where((x) => x.realEstateId === realEstateId)
        .map((x) => ({
          name: x.name,
          time: [
            // For a bar spanning two values recharts requires a tuple with the two values.
            new Date(x.startDate).getFullYear(),
            new Date(x.endDate).getFullYear(),
          ],
        }))
        .toArray(),
    [realEstateId],
  );

  return (
    <Box w="100%" h="100%" {...rest}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart layout="vertical" data={data ?? []} margin={{ left: 106 }}>
          <Tooltip />
          <XAxis type="number" dataKey="time" domain={[fromYear, toYear]} allowDataOverflow hide />
          <YAxis type="category" dataKey="name" domain={['dataMin', 'dataMax']} hide />
          <Bar dataKey="time" opacity={0.6} fill="red">
            <LabelList dataKey="name" position="center" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}
