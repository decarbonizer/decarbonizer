import {
  Grid,
  Heading,
  HStack,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Spacer,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FaRegQuestionCircle } from 'react-icons/fa';
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
      <Card w="100%" h="100%" pr="8" py="10" pt={3} borderBottomRadius={0} borderTopRightRadius={0} isStatic>
        <HStack pl="8">
          {budgetChartConfig.mode === 'cost' ? (
            <Heading size="lg">Cumulative Cost and Saving Budget Chart</Heading>
          ) : (
            <Heading size="lg">Produced carbon footprint Burn-Down-Chart</Heading>
          )}

          <Spacer />
          <Popover placement="left-end">
            <PopoverTrigger>
              <IconButton variant="ghost" aria-label="info" icon={<FaRegQuestionCircle size="25" />} />
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverHeader>Additional information</PopoverHeader>
              {budgetChartConfig.mode === 'cost' ? (
                <PopoverBody>
                  Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut
                  labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores
                  et ea rebum.
                </PopoverBody>
              ) : (
                <PopoverBody>
                  Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut
                  labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores
                  et ea rebum.
                </PopoverBody>
              )}
              <PopoverBody>
                Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut
                labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et
                ea rebum.
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </HStack>
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
