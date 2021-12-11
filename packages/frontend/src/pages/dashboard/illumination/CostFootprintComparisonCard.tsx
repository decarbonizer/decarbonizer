import { CartesianGrid, XAxis, YAxis, Tooltip, Area, AreaChart, Legend, ResponsiveContainer } from 'recharts';
import { ComparisonOfCalculations } from '../../../api/surveyAnswer';
import DashboardCard, { DashboardCardProps } from '../components/DashboardCard';

export interface CostFootprintComparisonCardProps extends DashboardCardProps {
  data: ComparisonOfCalculations[];
}

export default function CostFootprintComparisonCard({ data, ...rest }: CostFootprintComparisonCardProps) {
  return (
    <DashboardCard header="Compared bulb costs and footprints over years" {...rest}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 15,
          }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" label={{ value: 'Years', position: 'insideBottomRight' }} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Area type="monotone" dataKey="oldCosts" stackId="1" stroke="#8884d8" fill="#8884d8" label="old costs" />
          <Area type="monotone" dataKey="newCosts" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
          <Area type="monotone" dataKey="newFootprint" stackId="1" stroke="#ffc658" fill="#ffc658" />
          <Area type="monotone" dataKey="oldFootprint" stackId="1" stroke="#7ab356" fill="#7ab356" />
        </AreaChart>
      </ResponsiveContainer>
    </DashboardCard>
  );
}
