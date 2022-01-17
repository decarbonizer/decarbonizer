import { Grid } from '@chakra-ui/react';
import Card from '../../components/Card';
import DefaultPageLayout from '../../components/DefaultPageLayout';
import ActionPlanChart from './ActionPlanChart';
import BudgetChart from './BudgetChart';

export default function BudgetPage() {
  const fromYear = 2022;
  const toYear = 2050;

  return (
    <DefaultPageLayout
      contentProps={{ pr: '0' }}
      leftArea={
        <Card
          as="aside"
          isStatic
          flexGrow={1}
          w="md"
          borderBottomRadius={0}
          borderLeftRadius={0}
          h="calc(100vh - 5rem)"
          px="8"
          py="4"
          size="lg">
          Foo
        </Card>
      }>
      <Card w="100%" h="100%" pr="8" py="4" borderBottomRadius={0} borderTopRightRadius={0} isStatic>
        <Grid w="100%" h="100%" templateRows="10% 1fr">
          <ActionPlanChart fromYear={fromYear} toYear={toYear} />
          <BudgetChart fromYear={fromYear} toYear={toYear} />
        </Grid>
      </Card>
    </DefaultPageLayout>
  );
}
