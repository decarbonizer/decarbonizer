import { Flex, Grid, Heading } from '@chakra-ui/react';
import { getGlobalFootprintForAllRealEstates } from '../../../calculations/calculations/getGlobalSummedYearlyFootprint';
import { useCalculation } from '../../../calculations/useCalculation';
import DashboardCard from '../../dashboard/components/DashboardCard';
import CarbonTreeCard from '../../dashboard/global/CarbonTreeCard';
import ComparisonCard from './ComparisonCard';
import GlobalFootprintCard from './GlobalFootprintCard';
import NetZeroCard from './NetZeroCard';

export default function GlobalSection() {
  const { data } = useCalculation((externalCalculationData) =>
    getGlobalFootprintForAllRealEstates(externalCalculationData),
  );
  return (
    <Flex flexDir="column" pb="10">
      <Heading as="h2" size="lg">
        Global Overview
      </Heading>
      <Grid templateRows={'1fr'} templateColumns={'repeat(5, 1fr)'} gap={10} pt="4">
        <GlobalFootprintCard />
        <NetZeroCard />
        {data && (
          <DashboardCard>
            <CarbonTreeCard carbonFootprint={data} />
          </DashboardCard>
        )}
        <ComparisonCard gridColumn={'span 2'} />
      </Grid>
    </Flex>
  );
}
