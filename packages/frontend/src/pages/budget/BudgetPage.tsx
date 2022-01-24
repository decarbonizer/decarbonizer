import { Grid } from '@chakra-ui/react';
import { useState } from 'react';
import { ActionPlan } from '../../api/actionPlan';
import Card from '../../components/Card';
import DefaultPageLayout from '../../components/DefaultPageLayout';
import ActionPlanChart from './ActionPlanChart';
import ActionPlanSelectionPanel from './ActionPlanSelectionPanel';
import BudgetChart from './BudgetChart';
import FootprintBurnDownChart from './FootprintBurnDownChart';

export default function BudgetPage() {
  const [actionPlans, setActionPlans] = useState<Array<ActionPlan>>([]);
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
          <ActionPlanSelectionPanel actionPlans={actionPlans} setActionPlans={setActionPlans} />
        </Card>
      }>
      <Card w="100%" h="100%" pr="8" py="4" borderBottomRadius={0} borderTopRightRadius={0} isStatic>
        <Grid w="100%" h="100%" templateRows="10% 1fr">
          <ActionPlanChart fromYear={fromYear} toYear={toYear} actionPlans={actionPlans} />
          <BudgetChart fromYear={fromYear} toYear={toYear} actionPlans={actionPlans} />
        </Grid>
      </Card>
      <Card w="100%" h="100%" pr="8" py="4" borderBottomRadius={0} borderTopRightRadius={0} isStatic>
        <Grid w="100%" h="100%" templateRows="10% 1fr">
          <ActionPlanChart fromYear={fromYear} toYear={toYear} actionPlans={actionPlans} />
          <FootprintBurnDownChart fromYear={fromYear} toYear={toYear} actionPlans={actionPlans} />
        </Grid>
      </Card>
    </DefaultPageLayout>
  );
}
