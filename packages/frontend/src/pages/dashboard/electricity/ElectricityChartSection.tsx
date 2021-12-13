import { Grid } from '@chakra-ui/react';
import FootprintDeltaCard from './FootprintDeltaCard';

export default function ElectricityChartsSection() {
  return (
    <Grid flexGrow={1} templateColumns="repeat(6, 1fr)" templateRows="auto 1fr" gap="6">
      <FootprintDeltaCard gridRow="1" gridColumn="1 / span 2" />
    </Grid>
  );
}
