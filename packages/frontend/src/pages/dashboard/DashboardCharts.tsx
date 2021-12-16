import { Box, Flex, Select, SimpleGrid, Skeleton } from '@chakra-ui/react';
import { useContext, useState } from 'react';
import { useParams } from 'react-router';
import { ActionPlan } from '../../api/actionPlan';
import { ActionCategory, KnownActionId } from '../../data/actions/action';
import { RealEstatePageParams } from '../../routes';
import { useGetAllActionPlansForRealEstateQuery } from '../../store/api';
import ActionChartsSection from './ActionChartsSection';
import ChartSectionHeader from './components/ChartSectionHeader';
import { DashboardContext, FilledActionAnswers } from './dashboardContext';
import GlobalChartsSection from './GlobalChartsSection';

export interface DashboardChartsProps {
  selectedActionCategory?: ActionCategory;
}

export default function DashboardCharts({ selectedActionCategory }: DashboardChartsProps) {
  const { realEstateId } = useParams<RealEstatePageParams>();
  const dashboardContext = useContext(DashboardContext);
  const { actionPlanToEdit } = dashboardContext;
  const { data: actionPlans, isLoading: isLoadingActionPlans } = useGetAllActionPlansForRealEstateQuery({
    realEstateId,
  });
  const comparableActionPlans = (actionPlans ?? []).filter((actionPlan) => actionPlan._id !== actionPlanToEdit?._id);
  const [actionPlanComparand, setActionPlanComparand] = useState<ActionPlan | undefined>(undefined);
  const isComparingPlans = !!actionPlanComparand;
  const actionPlanComparandAnswers = (actionPlanComparand?.actionAnswers ?? []).reduce<FilledActionAnswers>(
    (acc, actionAnswer) => ({ ...acc, [actionAnswer._id as KnownActionId]: actionAnswer }),
    {},
  );

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

      <SimpleGrid columns={isComparingPlans ? 2 : 1} gap={8}>
        <GlobalChartsSection isNarrow={isComparingPlans} />
        {isComparingPlans && (
          <DashboardContext.Provider value={{ ...dashboardContext, filledActionAnswers: actionPlanComparandAnswers }}>
            <GlobalChartsSection isNarrow={isComparingPlans} />
          </DashboardContext.Provider>
        )}
      </SimpleGrid>

      {selectedActionCategory && (
        <>
          <ChartSectionHeader
            header="Action Impact"
            description="What impact do your currently visible actions to the left have?"
            mt="8"
            mb="4"
          />
          <SimpleGrid columns={isComparingPlans ? 2 : 1} gap={8}>
            <Box flexGrow={1} mb="8" display="flex" alignItems="stretch">
              <ActionChartsSection isNarrow={isComparingPlans} />
            </Box>
            {isComparingPlans && (
              <DashboardContext.Provider
                value={{ ...dashboardContext, filledActionAnswers: actionPlanComparandAnswers }}>
                <ActionChartsSection isNarrow={isComparingPlans} />
              </DashboardContext.Provider>
            )}
          </SimpleGrid>
        </>
      )}
    </>
  );
}
