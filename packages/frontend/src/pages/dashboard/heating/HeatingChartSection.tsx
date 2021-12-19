import { Grid } from '@chakra-ui/react';
import { ActionChartsSectionProps } from '../ActionChartsSection';
import CostDeltaCard from './CostDeltaCard';
import ComparisonOfCostsAndFootprints from './CostFootprintComparisonCard';
import FootprintDeltaCard from './FootprintDeltaCard';

export default function HeatingChartsSection({ isNarrow }: ActionChartsSectionProps) {
  return (
    <Grid
      flexGrow={1}
      templateRows={isNarrow ? 'auto auto 20rem' : 'auto 1fr'}
      templateColumns={isNarrow ? '1fr' : '1fr 1fr'}
      gap="6">
      <FootprintDeltaCard />
      <CostDeltaCard />
      <ComparisonOfCostsAndFootprints gridColumn={isNarrow ? undefined : 'span 2'} />
    </Grid>
  );
}
