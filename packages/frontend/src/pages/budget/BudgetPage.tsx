import { Grid } from '@chakra-ui/react';
import { useState } from 'react';
import { ActionPlan } from '../../api/actionPlan';
import Card from '../../components/Card';
import DefaultPageLayout from '../../components/DefaultPageLayout';
import { useLocalStorage } from '../../utils/useLocalStorage';
import ActionPlanChart from './ActionPlanChart';
import ActionPlanSelectionPanel from './ActionPlanSelectionPanel';
import BudgetChart, { BudgetChartConfig } from './BudgetChart';

const minYear = 2020;
const maxYear = 2050;

export default function BudgetPage() {
  const [actionPlans, setActionPlans] = useState<Array<ActionPlan>>([]);
  const [budgetChartConfig, setBudgetChartConfig] = useLocalStorage<BudgetChartConfig>(
    '@decarbonizer/budget:chartConfig',
    {
      fromYear: minYear,
      toYear: maxYear,
      mode: 'cost',
      showGrid: false,
      showProfit: false,
      showReferenceBudget: false,
      referenceBudget: 10_000,
    },
  );

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
          <ActionPlanSelectionPanel
            minYear={minYear}
            maxYear={maxYear}
            actionPlans={actionPlans}
            setActionPlans={setActionPlans}
            budgetChartConfig={budgetChartConfig}
            setBudgetChartConfig={setBudgetChartConfig}
          />
        </Card>
      }>
      <Card w="100%" h="100%" pr="8" py="4" borderBottomRadius={0} borderTopRightRadius={0} isStatic>
        <Grid w="100%" h="100%" templateRows="10% 1fr">
          <ActionPlanChart
            fromYear={budgetChartConfig.fromYear}
            toYear={budgetChartConfig.toYear}
            actionPlans={actionPlans}
          />
          <BudgetChart minYear={minYear} maxYear={maxYear} actionPlans={actionPlans} config={budgetChartConfig} />
        </Grid>
      </Card>
    </DefaultPageLayout>
  );
}
