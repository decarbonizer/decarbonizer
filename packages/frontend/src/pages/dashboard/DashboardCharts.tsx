import { Grid, Box } from '@chakra-ui/react';
import { ActionCategory } from '../../data/actions/action';
import ActionChartsSection from './ActionChartsSection';
import ChartSectionHeader from './components/ChartSectionHeader';
import ComparisonCard from './global/ComparisonCard';
import GlobalFootprintCard from './global/GlobalFootprintCard';
import NetZeroCard from './global/NetZeroCard';

export interface DashboardChartsProps {
  isNarrow: boolean;
  showHeaders: boolean;
  selectedActionCategory?: ActionCategory;
}

export default function DashboardCharts({ isNarrow, showHeaders, selectedActionCategory }: DashboardChartsProps) {
  return (
    <>
      <ChartSectionHeader
        visibility={showHeaders ? undefined : 'hidden'}
        header="Global"
        description="How does this real estate compare to others?"
        mb="4"
      />
      <Grid
        templateRows={isNarrow ? 'repeat(3, 1fr)' : '1fr'}
        templateColumns={isNarrow ? '1fr' : 'repeat(4, 1fr)'}
        gap={6}>
        <GlobalFootprintCard />
        <NetZeroCard />
        <ComparisonCard gridColumn={isNarrow ? undefined : 'span 2'} />
      </Grid>
      {selectedActionCategory && (
        <>
          <ChartSectionHeader
            visibility={showHeaders ? undefined : 'hidden'}
            header="Action Impact"
            description="What impact do your currently visible actions to the left have?"
            mt="8"
            mb="4"
          />
          <Box flexGrow={1} mb="8" display="flex" alignItems="stretch">
            <ActionChartsSection isNarrow={isNarrow} />
          </Box>
        </>
      )}
    </>
  );
}
