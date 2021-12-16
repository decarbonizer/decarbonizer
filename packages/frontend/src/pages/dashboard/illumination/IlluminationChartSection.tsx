import { Grid } from '@chakra-ui/react';
import CalculatedCostsCard from './CalculatedCostsCard';
import FootprintDeltaCard from './FootprintDeltaCard';
import ComparisonOfCostsAndFootprints from './FootprintComparisonChartCard';
import CostDeltaCard from './CostDeltaCard';
import CostComparisonChartCard from './CostComparisonChartCard';
import { ActionChartsSectionProps } from '../ActionChartsSection';

export default function IlluminationChartsSection({ isNarrow }: ActionChartsSectionProps) {
  return (
    <Grid
      flexGrow={1}
      templateRows={isNarrow ? 'auto auto 1fr 1fr 1fr' : 'auto auto 1fr'}
      templateColumns={isNarrow ? '1fr' : '1fr 1fr'}
      gap="6">
      <FootprintDeltaCard />
      <CostDeltaCard gridRow={isNarrow ? undefined : '2'} />
      <CalculatedCostsCard gridRow="span 2" />
      <ComparisonOfCostsAndFootprints />
      <CostComparisonChartCard />
    </Grid>
  );
}
