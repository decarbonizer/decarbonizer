import {
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  InputGroup,
  InputRightAddon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  useToast,
} from '@chakra-ui/react';
import { ActionPlanSummary } from './ActionPlanSummary';
import { Controller, useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router';
import { ActionPlan, ActionPlanCreate, ActionPlanStatus, ActionPlanUpdate } from '../../../api/actionPlan';
import DateRangePicker, { DateRange } from '../../../components/DateRangePicker';
import { RealEstatePageParams, routes } from '../../../routes';
import { useCreateActionPlanMutation, useUpdateActionPlanMutation } from '../../../store/api';
import range from 'lodash-es/range';
import { ActionAnswerBase } from '../../../api/actionAnswer';

export interface SaveActionPlanModalProps {
  isOpen: boolean;
  onClose(): void;
  actionPlan?: ActionPlan;
  actionAnswers?: Array<ActionAnswerBase>;
  isBudgetPage?: boolean;
}

interface FormValues {
  name: string;
  duration: DateRange;
  budget: number;
  status: ActionPlanStatus;
}

export default function SaveActionPlanModal({
  isOpen,
  onClose,
  actionAnswers,
  actionPlan,
  isBudgetPage,
}: SaveActionPlanModalProps) {
  const defaultValues: FormValues | undefined = actionPlan
    ? {
        name: actionPlan.name,
        budget: actionPlan.budget,
        status: actionPlan.status,
        duration: {
          startDate: actionPlan.startDate ? new Date(actionPlan.startDate) : undefined,
          endDate: actionPlan.endDate ? new Date(actionPlan.endDate) : undefined,
        },
      }
    : undefined;
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({ defaultValues });
  const { realEstateId } = useParams<RealEstatePageParams>();
  const [createActionPlan, { isLoading: isLoadingCreate }] = useCreateActionPlanMutation();
  const [updateActionPlan, { isLoading: isLoadingUpdate }] = useUpdateActionPlanMutation();
  const toast = useToast();
  const history = useHistory();

  const onSubmit = (data: FormValues) => {
    if (actionPlan) {
      const body: ActionPlanUpdate = {
        name: data.name,
        startDate: data.duration.startDate!,
        endDate: data.duration.endDate!,
        budget: +data.budget,
        status: data.status,
        actionAnswers: actionAnswers ?? actionPlan.actionAnswers,
      };

      updateActionPlan({ id: actionPlan._id, body })
        .unwrap()
        .then(() => {
          toast({
            title: 'Action Plan Updated',
            description: 'The action plan was successfully updated.',
            status: 'success',
            isClosable: true,
            duration: 5000,
          });

          onClose();
        })
        .catch(() =>
          toast({
            title: 'Action Plan Update Failed',
            description: 'Unfortunately the action plan could not be updated. Please try again.',
            status: 'error',
            isClosable: true,
          }),
        );
    } else {
      const body: ActionPlanCreate = {
        name: data.name,
        startDate: data.duration.startDate!,
        endDate: data.duration.endDate!,
        budget: +data.budget,
        status: data.status,
        actionAnswers: actionAnswers ?? [],
      };
      createActionPlan({ realEstateId, body })
        .unwrap()
        .then(() => {
          toast({
            title: 'Action Plan Created',
            description: 'The action plan was successfully created.',
            status: 'success',
            isClosable: true,
            duration: 5000,
          });

          onClose();
        })
        .catch(() =>
          toast({
            title: 'Action Plan Creation Failed',
            description: 'Unfortunately the action plan could not be created. Please try again.',
            status: 'error',
            isClosable: true,
          }),
        );
    }
    {
      !isBudgetPage && history.push(routes.actionPlans({ realEstateId }));
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={'3xl'}>
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>{actionPlan ? 'Update Action Plan' : 'New Action Plan'}</ModalHeader>
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

            <FormControl mt="8" isRequired isInvalid={!!errors.duration}>
              <FormLabel>Planned duration</FormLabel>
              <Controller
                name="duration"
                control={control}
                rules={{ required: { value: true, message: 'This field is required.' } }}
                render={({ field }) => (
                  <DateRangePicker
                    selectableYears={range(new Date().getFullYear(), 2051)}
                    value={field.value}
                    onValueChanged={(e) => field.onChange(e)}
                  />
                )}
              />

              <FormHelperText>
                Specify the planned duration during which you would like to implement the actions.
              </FormHelperText>
              <FormErrorMessage></FormErrorMessage>
            </FormControl>

            <FormControl mt="8">
              <FormLabel>Plan Budget</FormLabel>
              <InputGroup>
                <Input
                  type="number"
                  placeholder="Enter your budget for this action plan"
                  min={0}
                  {...register('budget', {
                    min: { value: 0, message: 'The budget cannot be negative.' },
                  })}
                />
                <InputRightAddon>€</InputRightAddon>
              </InputGroup>
            </FormControl>

            <FormControl mt="8">
              <FormLabel>Status:</FormLabel>
              <Select defaultValue={'open'} {...register('status')}>
                <option value="open">Open</option>
                <option value="inProgress">In Progress</option>
                <option value="finished">Finished</option>
              </Select>
            </FormControl>

            <FormLabel fontWeight="semibold" mt={8}>
              Selected Actions
            </FormLabel>
            <ActionPlanSummary actionAnswers={actionAnswers ?? actionPlan?.actionAnswers ?? []} />
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose} mr="3">
              Cancel
            </Button>
            <Button type="submit" colorScheme="primary" isLoading={isLoadingCreate || isLoadingUpdate}>
              Save
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
