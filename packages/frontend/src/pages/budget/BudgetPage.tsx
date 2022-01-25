import { Grid, HStack, Radio, RadioGroup } from '@chakra-ui/react';
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
        <Grid w="100%" h="100%" templateRows="auto 10% 1fr">
          <RadioGroup
            colorScheme="green"
            value={budgetChartMode}
            onChange={(value) => setBudgetChartMode(value as BudgetChartMode)}>
            <HStack ml="6">
              <Radio value="cost">Cost</Radio>
              <Radio value="co2">Carbon Footprint</Radio>
            </HStack>
          </RadioGroup>
          <ActionPlanChart fromYear={fromYear} toYear={toYear} actionPlans={actionPlans} />
          <BudgetChart fromYear={fromYear} toYear={toYear} actionPlans={actionPlans} mode={budgetChartMode} />
        </Grid>
      </Card>
    </DefaultPageLayout>
  );
}
