import { Checkbox, VStack, Heading, CheckboxGroup, IconButton, Icon, HStack, Spacer } from '@chakra-ui/react';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import { useParams } from 'react-router';
import { ActionPlan } from '../../api/actionPlan';
import { RealEstatePageParams } from '../../routes';
import { useGetAllActionPlansForRealEstateQuery } from '../../store/api';
import SaveActionPlanModal from '../dashboard/action-panel/SaveActionPlanModal';

export interface ActionPlanSelectionPanelProps {
  actionPlans: Array<ActionPlan>;
  setActionPlans: Dispatch<SetStateAction<Array<ActionPlan>>>;
}

export default function ActionPlanSelectionPanel({ actionPlans, setActionPlans }: ActionPlanSelectionPanelProps) {
  const { realEstateId } = useParams<RealEstatePageParams>();
  const { data: allActionPlans } = useGetAllActionPlansForRealEstateQuery({ realEstateId });
  const [actionPlanToEdit, setActionPlanToEdit] = useState<ActionPlan | undefined>(undefined);

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
          <HStack key={actionPlan._id} w="100%">
            <Checkbox value={actionPlan._id}>{actionPlan.name}</Checkbox>
            <Spacer />
            <IconButton
              variant="ghost"
              aria-label="Edit"
              icon={<Icon as={FaEdit} />}
              onClick={() => setActionPlanToEdit(actionPlan)}
            />
          </HStack>
        ))}
      </CheckboxGroup>
      {actionPlanToEdit && (
        <SaveActionPlanModal isOpen actionPlan={actionPlanToEdit} onClose={() => setActionPlanToEdit(undefined)} />
      )}
    </VStack>
  );
}
