import {
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
} from '@chakra-ui/react';
import { ActionPlanSummary } from './ActionPlanSummary';
import { isEmpty } from 'lodash';
import { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router';
import { ActionPlanCreate } from '../../../api/actionPlan';
import { DashboardPageParams } from '../../../routes';
import { useCreateActionPlanMutation } from '../../../store/api';
import { ActionPanelContext } from './actionPanelContext';

export interface SaveActionPlanModalProps {
  isOpen: boolean;
  onClose(): void;
}

interface FormValues {
  name: string;
  startDate: Date;
  endDate: Date;
}

export default function SaveActionPlanModal({ isOpen, onClose }: SaveActionPlanModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
  const { realEstateId } = useParams<DashboardPageParams>();
  const [createActionPlan, { isLoading }] = useCreateActionPlanMutation();
  const { filledActionAnswers } = useContext(ActionPanelContext);
  const toast = useToast();

  const onSubmit = (data: FormValues) => {
    const body: ActionPlanCreate = {
      ...data,
      actionAnswers: Object.values(filledActionAnswers).filter((actionAnswer) => !isEmpty(actionAnswer)),
    };

    createActionPlan({ realEstateId, body })
      .unwrap()
      .then(() =>
        toast({
          title: 'Action Plan Created',
          description: 'The action plan was successfully created.',
          status: 'success',
          isClosable: true,
          duration: 5000,
        }),
      )
      .catch(() =>
        toast({
          title: 'Action Plan Creation Failed',
          description: 'Unfortunately the action plan could not be created. Please try again.',
          status: 'error',
          isClosable: true,
        }),
      )
      .finally(onClose);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={'3xl'}>
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>New Action Plan</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isRequired isInvalid={!!errors.name}>
              <FormLabel htmlFor="name">Plan name</FormLabel>
              <Input
                type="text"
                min={1}
                max={255}
                {...register('name', {
                  required: { value: true, message: 'This field is required.' },
                  minLength: { value: 1, message: 'The name must be at least 1 character long.' },
                  maxLength: { value: 255, message: 'The name must be at most 255 characters long.' },
                })}
              />
              <FormHelperText>The name helps you identify the plan later on.</FormHelperText>
              <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
            </FormControl>

            <FormLabel fontWeight="semibold" mt={8}>
              Selected Actions
            </FormLabel>
            <ActionPlanSummary />
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose} mr="3">
              Cancel
            </Button>
            <Button type="submit" colorScheme="primary" isLoading={isLoading}>
              Save
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
