import { ActionChartsSectionProps } from '../ActionChartsSection';
import { Grid } from '@chakra-ui/react';
import FootprintDeltaCard from './FootprintDeltaCard';
import FootprintComparisonChartCard from './FootprintComparisonChartCard';
import CostDeltaCard from './CostDeltaCard';
import CalculatedCostsCard from './CalculatedCostsCard';
import CostComparisonChartCard from './CostComparisonChartCard';

export default function HeatingChartsSection({ isNarrow }: ActionChartsSectionProps) {
  return (
    <Grid
      flexGrow={1}
      templateRows={isNarrow ? 'auto auto 20rem 20rem 20rem' : 'auto auto 1fr'}
      templateColumns={isNarrow ? '1fr' : '1fr 1fr'}
      gap="6">
      <FootprintDeltaCard />
      <CostDeltaCard gridRow={isNarrow ? undefined : '2'} />
      <CalculatedCostsCard gridRow={isNarrow ? undefined : 'span 2'} />
      <FootprintComparisonChartCard />
      <CostComparisonChartCard />
    </Grid>
  );
}
