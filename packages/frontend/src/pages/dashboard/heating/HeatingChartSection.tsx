import { Grid } from '@chakra-ui/react';
import CostDeltaCard from './CostDeltaCard';
import ComparisonOfCostsAndFootprints from './CostFootprintComparisonCard';
import FootprintDeltaCard from './FootprintDeltaCard';

export default function HeatingChartsSection() {
  return (
    <Grid flexGrow={1} templateColumns="repeat(6, 1fr)" templateRows="auto 1fr" gap="6">
      <FootprintDeltaCard gridRow="1" gridColumn="1 / span 2" />
      <CostDeltaCard gridRow="1" gridColumn="3 / span 2" />
      <ComparisonOfCostsAndFootprints gridRow="2 / span 13" gridColumn="1 / span 3" />
    </Grid>
  );
}
