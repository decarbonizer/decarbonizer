import { Flex, Grid, Heading } from '@chakra-ui/react';
import DashboardCard from '../../dashboard/components/DashboardCard';
import CarbonTreeQuickInfo from '../../dashboard/global/CarbonTreeQuickInfo';
import GlobalRealEstateFootprintComparisonCard from './GlobalRealEstateFootprintComparisonCard';
import GlobalFootprintCard from './GlobalFootprintCard';
import NetZeroCard from './NetZeroCard';
import { useAsyncCalculation } from '../../../calculations/useAsyncCalculation';

export default function GlobalSection() {
  const { isLoading, data } = useAsyncCalculation('getGlobalCompanyFootprintCardData', () => [], []);

  return (
    <Flex flexDir="column" pb="10">
      <Heading as="h2" size="lg">
        Global Overview
      </Heading>
      <Grid templateRows={'1fr'} templateColumns={'repeat(5, 1fr)'} gap={10} pt="4">
        <GlobalFootprintCard />
        <NetZeroCard />
        <DashboardCard showRevalidatingSpinner={isLoading}>
          <CarbonTreeQuickInfo carbonFootprint={data ?? 0} isLoading={!data} />
        </DashboardCard>
        <GlobalRealEstateFootprintComparisonCard gridColumn={'span 2'} />
      </Grid>
    </Flex>
  );
}
