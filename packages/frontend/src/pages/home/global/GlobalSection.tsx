import { Flex, Grid, Heading } from '@chakra-ui/react';
import { getTransformedFootprintPerYear } from '../../../calculations/global/footprint';
import { useCalculation } from '../../../calculations/useCalculation';
import DashboardCard from '../../dashboard/components/DashboardCard';
import CarbonTreeCard from '../../dashboard/global/CarbonTreeCard';
import ComparisonCard from './ComparisonCard';
import GlobalFootprintCard from './GlobalFootprintCard';
import NetZeroCard from './NetZeroCard';

export default function GlobalSection() {
  const { data } = useCalculation((externalCalculationData) => {
    return externalCalculationData.realEstates
      .map((realEstate) => {
        const surveyAnswersInitital = externalCalculationData.surveyAnswers.filter(
          (surveyAnswer) => surveyAnswer.realEstateId === realEstate._id,
        );
        const actionAnswers = externalCalculationData.actionPlans
          .filter((actionPlan) => actionPlan.realEstateId === realEstate._id)
          .flatMap((actionPlan) => actionPlan.actionAnswers);
        const footprint = getTransformedFootprintPerYear(
          externalCalculationData,
          surveyAnswersInitital,
          actionAnswers,
        ).globalFootprint;
        return footprint;
      })
      .reduce((a, b) => a + b, 0);
  });
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
