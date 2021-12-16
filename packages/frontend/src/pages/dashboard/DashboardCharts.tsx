import { Box, Flex, Select, Skeleton } from '@chakra-ui/react';
import { useContext, useState } from 'react';
import { useParams } from 'react-router';
import { ActionPlan } from '../../api/actionPlan';
import { ActionCategory } from '../../data/actions/action';
import { RealEstatePageParams } from '../../routes';
import { useGetAllActionPlansForRealEstateQuery } from '../../store/api';
import ActionChartsSection from './ActionChartsSection';
import ChartSectionHeader from './components/ChartSectionHeader';
import { DashboardContext } from './dashboardContext';
import GlobalChartsSection from './GlobalChartsSection';

export interface DashboardChartsProps {
  selectedActionCategory?: ActionCategory;
}

export default function DashboardCharts({ selectedActionCategory }: DashboardChartsProps) {
  const { realEstateId } = useParams<RealEstatePageParams>();
  const { actionPlanToEdit } = useContext(DashboardContext);
  const { data: actionPlans, isLoading: isLoadingActionPlans } = useGetAllActionPlansForRealEstateQuery({
    realEstateId,
  });
  const comparableActionPlans = (actionPlans ?? []).filter((actionPlan) => actionPlan._id !== actionPlanToEdit?._id);
  const [actionPlanComparand, setActionPlanComparand] = useState<ActionPlan | undefined>(undefined);
  const isComparingPlans = !!actionPlanComparand;

  return (
    <>
      <Flex justify="space-between">
        <ChartSectionHeader header="Global" description="How does this real estate compare to others?" mb="4" />
        {isLoadingActionPlans && <Skeleton w="80" h="10" />}
        {actionPlans && comparableActionPlans.length && (
          <Select
            w="80"
            bg="white"
            placeholder="Compare with other plans..."
            onChange={(e) =>
              setActionPlanComparand(
                e.target.value
                  ? comparableActionPlans.find((actionPlan) => actionPlan._id === e.target.value)
                  : undefined,
              )
            }>
            {comparableActionPlans.map((actionPlan) => (
              <option key={actionPlan._id} value={actionPlan._id}>
                {actionPlan.name}
              </option>
            ))}
          </Select>
        )}
      </Flex>
      <GlobalChartsSection isNarrow={isComparingPlans} />
      {selectedActionCategory && (
        <>
          <ChartSectionHeader
            header="Action Impact"
            description="What impact do your currently visible actions to the left have?"
            mt="8"
            mb="4"
          />
          <Box flexGrow={1} mb="8" display="flex" alignItems="stretch">
            <ActionChartsSection isNarrow={isComparingPlans} />
          </Box>
        </>
      )}
    </>
  );
}
