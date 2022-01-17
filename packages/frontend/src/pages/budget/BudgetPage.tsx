import { Box } from '@chakra-ui/react';
import DefaultPageLayout from '../../components/DefaultPageLayout';
import ActionPlanChart from './ActionPlanChart';
import BudgetChart from './BudgetChart';

export default function BudgetPage() {
  const fromYear = 2022;
  const toYear = 2050;

  return (
    <DefaultPageLayout title="Budget Planning">
      <Box w="100%" h="100%">
        <ActionPlanChart h="9%" fromYear={fromYear} toYear={toYear} />
        <BudgetChart h="90%" fromYear={fromYear} toYear={toYear} />
      </Box>
    </DefaultPageLayout>
  );
}
