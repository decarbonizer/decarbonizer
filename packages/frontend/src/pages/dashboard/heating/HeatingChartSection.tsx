import { Grid } from '@chakra-ui/react';
import CostDeltaCard from './CostDeltaCard';
import FootprintDeltaCard from './FootprintDeltaCard';
import FootprintComparisonChartCard from './FootprintComparisonChartCard';
import CostComparisonChartCard from './CostComparisonChartCard';
import CalculatedCostsCard from './CalculatedCostsCard';
import { ActionChartsSectionProps } from '../ActionChartsSection';

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
