import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, ResponsiveContainer } from 'recharts';
import DashboardCard, { DashboardCardProps } from '../components/DashboardCard';

export default function OverallCostComparisonCard(props: DashboardCardProps) {
  const data = [
    {
      legacy: 2500,
      optimized: 8000,
      amt: 2400,
    },
    {
      legacy: 3000,
      optimized: 7000,
      amt: 2210,
    },
    {
      legacy: 5000,
      optimized: 6000,
      amt: 2290,
    },
    {
      legacy: 6000,
      optimized: 5000,
      amt: 2000,
    },
    {
      legacy: 6000,
      optimized: 4500,
      amt: 2181,
    },
    {
      legacy: 7000,
      optimized: 3000,
      amt: 2500,
    },
    {
      legacy: 8000,
      optimized: 2500,
      amt: 2100,
    },
  ];

  return (
    <DashboardCard header="Legacy and optimized costs" {...props}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="optimized" fill="green" />
          <Bar dataKey="legacy" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </DashboardCard>
  );
}
