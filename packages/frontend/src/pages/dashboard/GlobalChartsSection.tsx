import { Grid } from '@chakra-ui/react';
import ComparisonCard from './global/ComparisonCard';
import GlobalFootprintCard from './global/GlobalFootprintCard';
import NetZeroCard from './global/NetZeroCard';

export interface GlobalChartsSectionProps {
  isNarrow: boolean;
}

export default function GlobalChartsSection({ isNarrow }: GlobalChartsSectionProps) {
  return (
    <Grid
      templateRows={isNarrow ? 'repeat(3, 1fr)' : '1fr'}
      templateColumns={isNarrow ? '1fr' : 'repeat(4, 1fr)'}
      gap={6}>
      <GlobalFootprintCard />
      <NetZeroCard />
      <ComparisonCard gridColumn={isNarrow ? undefined : 'span 2'} />
    </Grid>
  );
}
