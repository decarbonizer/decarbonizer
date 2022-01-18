import { Checkbox, VStack, Heading, CheckboxGroup } from '@chakra-ui/react';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { useParams } from 'react-router';
import { ActionPlan } from '../../api/actionPlan';
import { RealEstatePageParams } from '../../routes';
import { useGetAllActionPlansForRealEstateQuery } from '../../store/api';

export interface ActionPlanSelectionPanelProps {
  actionPlans: Array<ActionPlan>;
  setActionPlans: Dispatch<SetStateAction<Array<ActionPlan>>>;
}

export default function ActionPlanSelectionPanel({ actionPlans, setActionPlans }: ActionPlanSelectionPanelProps) {
  const { realEstateId } = useParams<RealEstatePageParams>();
  const { data: allActionPlans } = useGetAllActionPlansForRealEstateQuery({ realEstateId });

  useEffect(() => {
    setActionPlans(allActionPlans ?? []);
  }, [allActionPlans]);

  return (
    <VStack align="flex-start">
      <Heading as="h2" size="lg" isTruncated>
        Budget Management
      </Heading>
      <CheckboxGroup
        colorScheme="primary"
        value={actionPlans.map((plan) => plan._id)}
        onChange={(selectedPlanIds) =>
          setActionPlans(allActionPlans!.filter((actionPlan) => selectedPlanIds.includes(actionPlan._id)))
        }>
        {allActionPlans?.map((actionPlan) => (
          <Checkbox key={actionPlan._id} value={actionPlan._id}>
            {actionPlan.name}
          </Checkbox>
        ))}
      </CheckboxGroup>
    </VStack>
  );
}
