import { ActionChartsSectionProps } from '../ActionChartsSection';
import { Grid } from '@chakra-ui/react';
import FootprintDeltaCard from './FootprintDeltaCard';
import FootprintComparisonChartCard from './FootprintComparisonChartCard';

export default function BusinessTravelChartSection({ isNarrow }: ActionChartsSectionProps) {
  return (
    <Grid
      flexGrow={1}
      templateRows={isNarrow ? 'auto auto 20rem 20rem 20rem' : 'auto auto 1fr'}
      templateColumns={'1fr'}
      gap="6">
      <FootprintDeltaCard />
      <FootprintComparisonChartCard />
    </Grid>
  );
}
