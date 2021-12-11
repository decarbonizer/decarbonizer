import {
  VStack,
  Flex,
  Heading,
  IconButton,
  Tooltip,
  Spacer,
  Text,
  useDisclosure,
  useToast,
  Badge,
  HStack,
} from '@chakra-ui/react';
import { GiFootprint } from 'react-icons/gi';
import { BiTargetLock } from 'react-icons/bi';
import { FaEdit } from 'react-icons/fa';
import { MdDeleteForever } from 'react-icons/md';
import { ActionPlan, ActionPlanStatus } from '../../api/actionPlan';
import Card from '../../components/Card';
import HaloIcon from '../../components/HaloIcon';
import QuickInfo from '../dashboard/components/QuickInfo';
import QuickInfoLabelDescription from '../dashboard/components/QuickInfoLabelDescription';
import DeleteAlertDialog from '../../components/DeleteAlertDialog';
import { useDeleteActionPlanMutation } from '../../store/api';
import SaveActionPlanModal from '../dashboard/action-panel/SaveActionPlanModal';
import { ActionPlansPageParams, routes } from '../../routes';
import { useHistory, useParams } from 'react-router';

export interface ActionPlanCardProps {
  actionPlan: ActionPlan;
}

export default function ActionPlanCard({ actionPlan }: ActionPlanCardProps) {
  const { realEstateId } = useParams<ActionPlansPageParams>();

  const [deleteActionPlanMutation] = useDeleteActionPlanMutation();
  const { isOpen: isOpenEditModal, onOpen: onOpenEditModal, onClose: onCloseEditModal } = useDisclosure();
  const { isOpen: isOpenAlert, onOpen: onOpenAlert, onClose: onCloseAlert } = useDisclosure();
  const toast = useToast();
  const history = useHistory();

  const onConfirm = async (actionPlan) => {
    await deleteActionPlanMutation({ id: actionPlan._id });
    toast({
      title: 'Action Plan deleted.',
      description: `${actionPlan.name} has been successfully deleted.`,
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
  };

  const onClick = () => {
    history.push(routes.realEstateDashboard({ realEstateId }));
  };

  return (
    <Card as="button" pos="relative" display="flex" flexDir="column" w="sm" h="sm" onClick={onClick}>
      <Flex w="100%" pl="5" pt="3" pr="2">
        <VStack align="flex-start">
          <HStack>
            <Heading size="md" fontWeight="semibold" pt="3" justifyContent="center">
              {actionPlan.name}
            </Heading>
            {BadgeStatus(actionPlan.status)}
          </HStack>
          <Text>
            {new Date(actionPlan.startDate).toLocaleDateString()} - {new Date(actionPlan.endDate).toLocaleDateString()}
          </Text>
          <Heading size="xs"></Heading>
        </VStack>
        <Spacer />
        <Tooltip label="Edit" hasArrow>
          <IconButton
            aria-label="edit"
            icon={<FaEdit />}
            mr="1"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onOpenEditModal();
            }}
          />
        </Tooltip>
        <Tooltip label="Delete" hasArrow>
          <IconButton
            aria-label="delete"
            fontSize="21"
            icon={<MdDeleteForever />}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onOpenAlert();
            }}
          />
        </Tooltip>
      </Flex>
      <VStack pl="5" pt="5" pb="5" h="100%" align="flex-start">
        <QuickInfo h="50%" icon={<HaloIcon icon={GiFootprint} />}>
          <QuickInfoLabelDescription label={<>{'⬇ 1.73t'}</>} description={'Before: 6.1t, After: 4.73t'} />
        </QuickInfo>

        <QuickInfo h="50%" icon={<HaloIcon icon={BiTargetLock} />}>
          <QuickInfoLabelDescription label={<>{'⬆ 40%'}</>} description={'Before: 38%, After: 40%'} />
        </QuickInfo>
      </VStack>
      <SaveActionPlanModal isOpen={isOpenEditModal} onClose={onCloseEditModal} actionPlan={actionPlan} />
      <DeleteAlertDialog
        isOpen={isOpenAlert}
        onCancel={onCloseAlert}
        onConfirm={() => onConfirm(actionPlan)}
        deleteTextHeader={`Delete ${actionPlan.name}?`}
        deleteTextDialog={`Are you sure you want to delete ${actionPlan.name}?`}
      />
    </Card>
  );
}

function BadgeStatus(status: ActionPlanStatus) {
  if (status == 'open') {
    return <Badge>Open</Badge>;
  } else if (status == 'inProgress') {
    return <Badge colorScheme="orange">In Progress</Badge>;
  } else {
    return <Badge colorScheme="primary">Finished</Badge>;
  }
}
