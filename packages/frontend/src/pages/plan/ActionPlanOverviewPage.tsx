import { Spinner } from '@chakra-ui/react';
import { useParams } from 'react-router';
import Card from '../../components/Card';
import DefaultPageLayout from '../../components/DefaultPageLayout';
import { ActionPlansPageParams } from '../../routes';
import { useGetAllActionPlansForRealEstateQuery } from '../../store/api';

export default function ActionPlanOverviewPage() {
  const { realEstateId } = useParams<ActionPlansPageParams>();
  const { data: actionPlans, isLoading: isLoadingActionPlans } = useGetAllActionPlansForRealEstateQuery({
    realEstateId: realEstateId,
  });
  return (
    <DefaultPageLayout title="Action Plans">
      {isLoadingActionPlans ? (
        <Spinner />
      ) : (
        actionPlans!.map((actionPlan, index) => <Card key={index}>{actionPlan.name} </Card>)
      )}
    </DefaultPageLayout>
  );
}
