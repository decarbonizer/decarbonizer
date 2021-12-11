import { Spinner, Wrap, WrapItem } from '@chakra-ui/react';
import { useParams } from 'react-router';
import DefaultPageLayout from '../../components/DefaultPageLayout';
import { ActionPlansPageParams } from '../../routes';
import { useGetAllActionPlansForRealEstateQuery } from '../../store/api';
import ActionPlanCard from './ActionPlanCard';

export default function ActionPlanOverviewPage() {
  const { realEstateId } = useParams<ActionPlansPageParams>();
  const { data: actionPlans, isLoading: isLoadingActionPlans } = useGetAllActionPlansForRealEstateQuery({
    realEstateId: realEstateId,
  });
  return (
    <DefaultPageLayout title="Action Plans">
      <Wrap spacing="4">
        {isLoadingActionPlans ? (
          <Spinner />
        ) : (
          actionPlans!.map((actionPlan) => (
            <WrapItem key={actionPlan._id}>
              <ActionPlanCard key={actionPlan._id} actionPlan={actionPlan} />
            </WrapItem>
          ))
        )}
      </Wrap>
    </DefaultPageLayout>
  );
}
