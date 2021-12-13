import { Grid } from '@chakra-ui/react';
import CalculatedCostsCard from './CalculatedCostsCard';
import FootprintDeltaCard from './FootprintDeltaCard';
import ComparisonOfCostsAndFootprints from './CostFootprintComparisonCard';
import CostDeltaCard from './CostDeltaCard';
import MaintenanceComparisonCard from './MaintenanceComparisonCard';

export default function IlluminationChartsSection() {
  return (
    <Grid flexGrow={1} templateColumns="repeat(6, 1fr)" templateRows="auto 1fr" gap="6">
      <FootprintDeltaCard gridRow="1" gridColumn="1 / span 2" />
      <CostDeltaCard gridRow="1" gridColumn="3 / span 2" />
      <ComparisonOfCostsAndFootprints gridRow="2 / span 13" gridColumn="1 / span 3" />
      <MaintenanceComparisonCard gridRow="2 / span 13" gridColumn="4 / span 6" />
      <CalculatedCostsCard gridRow="15" gridColumn="1 / span 2" />
    </Grid>
  );
}
