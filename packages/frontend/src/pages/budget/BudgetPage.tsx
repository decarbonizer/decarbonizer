import { Grid } from '@chakra-ui/react';
import { useState } from 'react';
import { ActionPlan } from '../../api/actionPlan';
import Card from '../../components/Card';
import DefaultPageLayout from '../../components/DefaultPageLayout';
import ActionPlanChart from './ActionPlanChart';
import ActionPlanSelectionPanel from './ActionPlanSelectionPanel';
import BudgetChart, { BudgetChartMode } from './BudgetChart';

export default function BudgetPage() {
  const [actionPlans, setActionPlans] = useState<Array<ActionPlan>>([]);
  const [budgetChartMode, setBudgetChartMode] = useState<BudgetChartMode>('cost');
  const [showProfitLine, setShowProfitLine] = useState(false);
  const [fromYear, setFromYear] = useState(new Date().getFullYear());
  const [toYear, setToYear] = useState(2050);

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
            minYear={new Date().getFullYear()}
            maxYear={2050}
            fromYear={fromYear}
            setFromYear={setFromYear}
            toYear={toYear}
            setToYear={setToYear}
            budgetChartMode={budgetChartMode}
            setBudgetChartMode={setBudgetChartMode}
            actionPlans={actionPlans}
            setActionPlans={setActionPlans}
            showProfitLine={showProfitLine}
            setShowProfitLine={setShowProfitLine}
          />
        </Card>
      }>
      <Card w="100%" h="100%" pr="8" py="4" borderBottomRadius={0} borderTopRightRadius={0} isStatic>
        <Grid w="100%" h="100%" templateRows="10% 1fr">
          <ActionPlanChart fromYear={fromYear} toYear={toYear} actionPlans={actionPlans} />
          <BudgetChart
            fromYear={fromYear}
            toYear={toYear}
            actionPlans={actionPlans}
            mode={budgetChartMode}
            showProfit={showProfitLine}
          />
        </Grid>
      </Card>
    </DefaultPageLayout>
  );
}
