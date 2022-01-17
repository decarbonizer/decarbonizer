import { Grid } from '@chakra-ui/react';
import DefaultPageLayout from '../../components/DefaultPageLayout';
import ActionPlanChart from './ActionPlanChart';
import BudgetChart from './BudgetChart';

export default function BudgetPage() {
  const fromYear = 2022;
  const toYear = 2050;

  return (
    <DefaultPageLayout title="Budget Planning">
      <Grid w="100%" h="100%" templateRows="10% 1fr">
        <ActionPlanChart fromYear={fromYear} toYear={toYear} />
        <BudgetChart fromYear={fromYear} toYear={toYear} />
      </Grid>
    </DefaultPageLayout>
  );
}
