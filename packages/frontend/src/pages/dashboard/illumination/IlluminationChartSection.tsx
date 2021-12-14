import { Grid } from '@chakra-ui/react';
import CalculatedCostsCard from './CalculatedCostsCard';
import FootprintDeltaCard from './FootprintDeltaCard';
import ComparisonOfCostsAndFootprints from './FootprintComparisonChartCard';
import CostDeltaCard from './CostDeltaCard';
import CostComparisonChartCard from './CostComparisonChartCard';

export default function IlluminationChartsSection() {
  return (
    <Grid flexGrow={1} templateRows="auto auto 1fr" templateColumns="repeat(4, 1fr)" gap="6">
      <FootprintDeltaCard gridRow="1" gridColumn="1 / span 2" />
      <CostDeltaCard gridRow="2" gridColumn="1 / span 2" />
      <CalculatedCostsCard gridRow="1 / span 2" gridColumn="3 / span 2" />
      <ComparisonOfCostsAndFootprints gridRow="3" gridColumn="1 / span 2" />
      <CostComparisonChartCard gridRow="3" gridColumn="3 / span 2" />
    </Grid>
  );
}
