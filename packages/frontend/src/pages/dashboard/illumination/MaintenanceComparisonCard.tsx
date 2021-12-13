import { CartesianGrid, XAxis, YAxis, Tooltip, Area, AreaChart, Legend, ResponsiveContainer } from 'recharts';
import DashboardCard, { DashboardCardProps } from '../components/DashboardCard';

export default function MaintenanceComparisonCard(props: DashboardCardProps) {
  const data = [];

  return (
    <DashboardCard header="Compared maintenance costs over years" {...props}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          syncId="compareData"
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
          <Area
            type="monotone"
            dataKey="oldCostsForBulbsReplacement"
            stackId="1"
            stroke="#8884d8"
            fill="#8884d8"
            label="old costs"
          />
          <Area type="monotone" dataKey="newCostsForBulbsReplacement" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
          <Area type="monotone" dataKey="oldCostsForBulbs" stackId="1" stroke="#ffc658" fill="#ffc658" />
          <Area type="monotone" dataKey="newCostsForBulbs" stackId="1" stroke="#7ab356" fill="#7ab356" />
        </AreaChart>
      </ResponsiveContainer>
    </DashboardCard>
  );
}
