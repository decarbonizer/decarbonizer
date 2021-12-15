import { Spinner, Wrap, WrapItem, Text, Flex, Grid } from '@chakra-ui/react';
import { useState } from 'react';
import { useParams } from 'react-router';
import DefaultPageLayout from '../../components/DefaultPageLayout';
import EmptyState from '../../components/EmptyState';
import Searchbar from '../../components/Searchbar';
import { ActionPlansPageParams } from '../../routes';
import { useGetAllActionPlansForRealEstateQuery } from '../../store/api';
import ActionPlanCard from './ActionPlanCard';
import cloud from '../../img/cloud.svg';

export default function ActionPlanOverviewPage() {
  const { realEstateId } = useParams<ActionPlansPageParams>();
  const { data: actionPlans, isLoading: isLoadingActionPlans } = useGetAllActionPlansForRealEstateQuery({
    realEstateId: realEstateId,
  });
  const [searchValue, setSearchValue] = useState<string>('');
  const filteredActionPlans = actionPlans?.filter((actionPlan) => {
    return actionPlan.name.toLowerCase().includes(searchValue.toLowerCase());
  });

  return (
    <DefaultPageLayout
      title="Action Plans"
      actions={<Searchbar placeholder="Search for action plan.." onChange={setSearchValue} />}>
      <Wrap spacing="4" pt="3">
        {isLoadingActionPlans ? (
          <Spinner />
        ) : filteredActionPlans?.length === 0 ? (
          <EmptyState imgSrc={cloud} title="No Result" description={`Could not find an action plan`} />
        ) : (
          filteredActionPlans!.map((actionPlan) => (
            <WrapItem key={actionPlan._id}>
              <ActionPlanCard key={actionPlan._id} currentActionPlan={actionPlan} />
            </WrapItem>
          ))
        )}
      </Wrap>
    </DefaultPageLayout>
  );
}
