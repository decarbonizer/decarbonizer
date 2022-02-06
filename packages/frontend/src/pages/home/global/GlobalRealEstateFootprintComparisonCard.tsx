import { SkeletonText } from '@chakra-ui/react';
import { ResponsiveContainer, BarChart, Tooltip, XAxis, YAxis, Bar, Legend } from 'recharts';
import { useAsyncCalculation } from '../../../calculations/useAsyncCalculation';
import InlineErrorDisplay from '../../../components/InlineErrorDisplay';
import { palette } from '../../../utils/colorsChart';
import DashboardCard, { DashboardCardProps } from '../../dashboard/components/DashboardCard';

export default function GlobalRealEstateFootprintComparisonCard(props: DashboardCardProps) {
  const { isLoading, data, error } = useAsyncCalculation(
    'getRealEstateFootprintComparisonCardData',
    () => [undefined, undefined, undefined],
    [],
  );

  return (
    <DashboardCard header="Comparison of all real estates" showRevalidatingSpinner={isLoading} {...props}>
      <InlineErrorDisplay error={error}>
        {!data && <SkeletonText />}
        {data && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={[data]}>
              <Tooltip />
              <XAxis type="number" domain={['dataMin', 'dataMax']} hide />
              <YAxis type="category" domain={['dataMin', 'dataMax']} hide />
              {Object.entries(data).map(([realEstateName], i) => (
                <Bar
                  key={realEstateName}
                  dataKey={realEstateName}
                  stackId="co2"
                  fill={palette[i]}
                  opacity={0.6}
                  unit="kg"
                />
              ))}
              <Legend />
            </BarChart>
          </ResponsiveContainer>
        )}
      </InlineErrorDisplay>
    </DashboardCard>
  );
}
