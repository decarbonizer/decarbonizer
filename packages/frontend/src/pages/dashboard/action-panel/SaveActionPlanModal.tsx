import {
  Button,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
} from '@chakra-ui/react';
import { isEmpty } from 'lodash';
import { useContext } from 'react';
import { useParams } from 'react-router';
import { ActionPlanCreate } from '../../../api/actionPlan';
import { DashboardPageParams } from '../../../routes';
import { useCreateActionPlanMutation } from '../../../store/api';
import { ActionPanelContext } from './actionPanelContext';

export interface SaveActionPlanModalProps {
  isOpen: boolean;
  onClose(): void;
}

export default function SaveActionPlanModal({ isOpen, onClose }: SaveActionPlanModalProps) {
  const { realEstateId } = useParams<DashboardPageParams>();
  const [createActionPlan, { isLoading }] = useCreateActionPlanMutation();
  const { filledActionAnswers } = useContext(ActionPanelContext);
  const toast = useToast();

  const handleSaveClick = () => {
    const body: ActionPlanCreate = {
      name: 'TODO',
      startDate: new Date(),
      endDate: new Date(),
      actionAnswers: Object.values(filledActionAnswers).filter((actionAnswer) => !isEmpty(actionAnswer)),
    };

    createActionPlan({ realEstateId, body })
      .then(() =>
        toast({
          title: 'Action Plan Created',
          description: 'The action plan was successfully created.',
          status: 'success',
          duration: 5000,
        }),
      )
      .catch(() =>
        toast({
          title: 'Action Plan Creation Failed',
          description: 'Unfortunately the action plan could not be created. Please try again.',
          status: 'error',
        }),
      )
      .finally(onClose);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={'xl'}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>New Action Plan</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {/* TODO: Add name and time range form. */}
          <FormLabel fontWeight="semibold" mt={8}>
            Selected Actions
          </FormLabel>

          {/* TODO: Add selected actions view. */}
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose} mr="3">
            Cancel
          </Button>
          <Button colorScheme="primary" isLoading={isLoading} onClick={handleSaveClick}>
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
