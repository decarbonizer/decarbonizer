import {
  VStack,
  Heading,
  IconButton,
  Text,
  useDisclosure,
  useToast,
  Badge,
  HStack,
  SkeletonText,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  Box,
  MenuDivider,
} from '@chakra-ui/react';
import { GiFootprint } from 'react-icons/gi';
import { BiTargetLock, BiTrendingDown, BiTrendingUp } from 'react-icons/bi';
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
import { useParams } from 'react-router';
import { mapDeltaType } from '../../utils/deltaType';
import InlineErrorDisplay from '../../components/InlineErrorDisplay';
import { RiDashboardFill } from 'react-icons/ri';
import { TiEquals } from 'react-icons/ti';
import { FiMoreHorizontal } from 'react-icons/fi';
import { CgExport } from 'react-icons/all';
import { useAsyncCalculation } from '../../calculations/useAsyncCalculation';
import { useTransformedSurveyAnswers } from '../../utils/useTransformedSurveyAnswers';
import { Link } from 'react-router-dom';

export interface ActionPlanCardProps {
  currentActionPlan: ActionPlan;
}

export default function ActionPlanCard({ currentActionPlan }: ActionPlanCardProps) {
  const { realEstateId } = useParams<ActionPlansPageParams>();
  const [deleteActionPlanMutation] = useDeleteActionPlanMutation();
  const { isOpen: isOpenEditModal, onOpen: onOpenEditModal, onClose: onCloseEditModal } = useDisclosure();
  const { isOpen: isOpenAlert, onOpen: onOpenAlert, onClose: onCloseAlert } = useDisclosure();
  const toast = useToast();

  const surveyAnswers = useTransformedSurveyAnswers(currentActionPlan);
  const actionAnswers = currentActionPlan.actionAnswers;
  const { isLoading, data, error } = useAsyncCalculation(
    'getActionPlanCardData',
    () => [surveyAnswers.data!, realEstateId, actionAnswers],
    { skip: !surveyAnswers.data },
    [surveyAnswers, actionAnswers, realEstateId],
  );

  const carbonFootprint = data?.actionPlanFootprintDelta.delta ?? 0;
  const unitSymbol = Math.abs(carbonFootprint) >= 1000 ? 't' : 'kg';
  const adjustedFootprint = Math.abs(carbonFootprint) >= 1000 ? carbonFootprint / 1000 : carbonFootprint;

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

  return (
    <Card as="button" pos="relative" display="flex" flexDir="column" w="lg" h="sm">
      <Menu>
        <MenuButton
          as={IconButton}
          pos="absolute"
          top="2"
          right="2"
          aria-label="Options"
          icon={<Icon as={FiMoreHorizontal} />}
          variant="ghost"
        />
        <Portal>
          <MenuList transform="">
            <Link to={routes.realEstateDashboard({ realEstateId, actionPlanId: currentActionPlan._id })}>
              <MenuItem icon={<Icon as={RiDashboardFill} />}>Dashboard</MenuItem>
            </Link>
            <Link to={routes.actionPlanFileExport({ realEstateId, actionPlanId: currentActionPlan._id })}>
              <MenuItem icon={<Icon as={CgExport} />}>Export</MenuItem>
            </Link>
            <MenuDivider />
            <MenuItem
              icon={<Icon as={FaEdit} />}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onOpenEditModal();
              }}>
              Edit...
            </MenuItem>
            <MenuItem
              icon={<Icon as={MdDeleteForever} />}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onOpenAlert();
              }}>
              Delete...
            </MenuItem>
          </MenuList>
        </Portal>
      </Menu>

      <VStack flexGrow={1} p="4" align="stretch">
        <HStack align="center">
          <Heading size="md" fontWeight="semibold" textAlign="left">
            {currentActionPlan.name}
          </Heading>
          <Box>
            <BadgeStatus status={currentActionPlan.status} />
          </Box>
        </HStack>

        <Text layerStyle="hint" textAlign="left">
          {new Date(currentActionPlan.startDate).toLocaleDateString()} -{' '}
          {new Date(currentActionPlan.endDate).toLocaleDateString()}
        </Text>

        <Box pt="6" flexGrow={1}>
          <InlineErrorDisplay error={error}>
            {isLoading && <SkeletonText noOfLines={14} />}
            {data && (
              <VStack flexGrow={1} align="flex-start" spacing="4">
                <QuickInfo
                  icon={
                    <HaloIcon
                      icon={GiFootprint}
                      colorScheme={mapDeltaType(data.actionPlanFootprintDelta.deltaType, 'red', 'green', 'gray')}
                    />
                  }>
                  <QuickInfoLabelDescription
                    label={`${Math.abs(adjustedFootprint).toFixed(2)}${unitSymbol}`}
                    description={
                      <>
                        {data.actionPlanFootprintDelta.deltaType === 'decrease' ? 'less' : 'more'} CO<sub>2</sub>{' '}
                        produced
                      </>
                    }
                  />
                </QuickInfo>
                <QuickInfo
                  icon={
                    <HaloIcon
                      icon={BiTargetLock}
                      colorScheme={mapDeltaType(data?.netZero.deltaType, 'red', 'green', 'gray')}
                    />
                  }>
                  <QuickInfoLabelDescription
                    label={<>{data.netZero.deltaType === 'same' ? '0%' : `${data.netZero.newAdjustedAchievedGoal}%`}</>}
                    description={
                      <>
                        {data.netZero.deltaType === 'same'
                          ? 'change in net-zero'
                          : data?.netZero.deltaType === 'decrease'
                          ? `Net-Zero increased by ${data.netZero.newAdjustedAchievedGoal}%`
                          : `Net-zero decreased by ${data.netZero.newAdjustedAchievedGoal}% `}
                      </>
                    }
                  />
                </QuickInfo>
                <QuickInfo
                  icon={
                    <HaloIcon
                      icon={
                        data.originalConstantCost.delta === 0
                          ? TiEquals
                          : data.originalConstantCost.delta > 0
                          ? BiTrendingUp
                          : BiTrendingDown
                      }
                      colorScheme={mapDeltaType(data!.originalConstantCost.deltaType, 'red', 'green', 'gray')}
                    />
                  }>
                  <QuickInfoLabelDescription
                    label={`${Math.abs(data.originalConstantCost.delta).toFixed(2)}€`}
                    description={
                      <>
                        {data.originalConstantCost.delta === 0
                          ? 'increased'
                          : data.originalConstantCost.delta < 0
                          ? 'decreased '
                          : 'increased '}{' '}
                        costs
                      </>
                    }
                  />
                </QuickInfo>
              </VStack>
            )}
          </InlineErrorDisplay>
        </Box>
      </VStack>
      <SaveActionPlanModal isOpen={isOpenEditModal} onClose={onCloseEditModal} actionPlan={currentActionPlan} />
      <DeleteAlertDialog
        isOpen={isOpenAlert}
        onCancel={onCloseAlert}
        onConfirm={() => onConfirm(currentActionPlan)}
        deleteTextHeader={`Delete ${currentActionPlan.name}?`}
        deleteTextDialog={`Are you sure you want to delete ${currentActionPlan.name}?`}
      />
    </Card>
  );
}

function BadgeStatus(props: { status: ActionPlanStatus }) {
  if (props.status == 'open') {
    return <Badge>Open</Badge>;
  } else if (props.status == 'inProgress') {
    return <Badge colorScheme="orange">In Progress</Badge>;
  } else {
    return <Badge colorScheme="primary">Finished</Badge>;
  }
}
