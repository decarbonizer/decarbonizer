import DashboardCard, { DashboardCardProps } from './DashboardCard';
import { SkeletonText } from '@chakra-ui/react';
import InlineErrorDisplay from '../../../components/InlineErrorDisplay';
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ReactNode } from 'react';

export interface ComparisonChartCardProps extends DashboardCardProps {
  header: ReactNode;
  data: any[] | undefined;
  isLoading: boolean;
  error: unknown | undefined;
  syncId: string;
  oldDataKey: string;
  newDataKey: string;
  unit: string;
}

export default function ComparisonChartCard(props: ComparisonChartCardProps) {
  const { isLoading, data, error, syncId, oldDataKey, newDataKey, unit, ...dashboardCardProps } = props;

  return (
    <DashboardCard isExpandable {...dashboardCardProps}>
      <InlineErrorDisplay error={error}>
        {isLoading && <SkeletonText />}
        {data && (
          <ResponsiveContainer width="100%" height="100%" minHeight={200}>
            <AreaChart
              data={data}
              syncId={syncId}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 15,
              }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="Year" label={{ value: 'Years', position: 'insideBottomRight', offset: -10 }} />
              <YAxis />
              <Tooltip
                formatter={(value, label) => {
                  return [`${value} ${unit}`, label];
                }}
                labelFormatter={(year, values) => {
                  const oldFootprint = values[0]?.value as number;
                  const newFootprint = values[1]?.value as number;
                  return [`Savings after ${year} years: ${newFootprint - oldFootprint} ${unit}`];
                }}
              />
              <Legend />
              <Area type="monotone" dataKey={newDataKey} stroke="#9AE6B4" strokeWidth={3} fill="#9AE6B477" />
              <Area type="monotone" dataKey={oldDataKey} stroke="#B794F4" strokeWidth={3} fill="#B794F477" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </InlineErrorDisplay>
    </DashboardCard>
  );
}
