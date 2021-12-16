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
  SkeletonText,
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
import { getFootprintDelta } from '../../calculations/global/footprint';
import { useCalculation } from '../../calculations/useCalculation';
import { DataFrame } from 'data-forge';
import { mapDeltaType } from '../../utils/deltaType';
import InlineErrorDisplay from '../../components/InlineErrorDisplay';

export interface ActionPlanCardProps {
  currentActionPlan: ActionPlan;
}

export default function ActionPlanCard({ currentActionPlan }: ActionPlanCardProps) {
  const { realEstateId } = useParams<ActionPlansPageParams>();
  const [deleteActionPlanMutation] = useDeleteActionPlanMutation();
  const { isOpen: isOpenEditModal, onOpen: onOpenEditModal, onClose: onCloseEditModal } = useDisclosure();
  const { isOpen: isOpenAlert, onOpen: onOpenAlert, onClose: onCloseAlert } = useDisclosure();
  const toast = useToast();
  const history = useHistory();

  const { isLoading, data, error } = useCalculation(
    (externalCalculationData) => {
      const surveyAnswers = externalCalculationData.surveyAnswers.filter(
        (surveyAnswer) => surveyAnswer.value.isInitialSurvey && surveyAnswer.realEstateId === realEstateId,
      );
      const footPrintDelta = getFootprintDelta(
        externalCalculationData,
        externalCalculationData.surveyAnswers,
        new DataFrame(currentActionPlan.actionAnswers),
      );
      const netZeroCalculation = getFootprintDelta(
        externalCalculationData,
        surveyAnswers,
        new DataFrame(currentActionPlan.actionAnswers),
      );

      const delta =
        netZeroCalculation.delta < 0 ? Math.abs(netZeroCalculation.delta) : -Math.abs(netZeroCalculation.delta);
      const achievedGoal = delta / (netZeroCalculation.originalFootprint / 100);
      const adjustedAchievedGoal = achievedGoal > 100 ? 100 : achievedGoal.toFixed(2);

      return {
        footPrintDelta,
        netZeroCalculation,
        adjustedAchievedGoal,
      };
    },

    [currentActionPlan.actionAnswers],
  );

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
              {currentActionPlan.name}
            </Heading>
            {<BadgeStatus status={currentActionPlan.status} />}
          </HStack>
          <Text>
            {new Date(currentActionPlan.startDate).toLocaleDateString()} -{' '}
            {new Date(currentActionPlan.endDate).toLocaleDateString()}
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
      <InlineErrorDisplay error={error}>
        {isLoading && <SkeletonText />}
        {data && (
          <VStack pl="5" pt="5" pb="5" h="100%" align="flex-start">
            <QuickInfo
              icon={
                <HaloIcon
                  icon={GiFootprint}
                  colorScheme={mapDeltaType(data.footPrintDelta.deltaType, 'red', 'green', 'gray')}
                />
              }>
              <QuickInfoLabelDescription
                label={`${Math.abs(data.footPrintDelta.delta).toFixed(2)}kg`}
                description={
                  <>
                    {data.footPrintDelta.deltaType === 'decrease' ? 'less' : 'more'} CO<sub>2</sub> produced
                  </>
                }
                furtherDescription={
                  <>
                    {`Before: ${data.footPrintDelta.originalFootprint.toFixed(2)}, `}
                    {`After: ${data.footPrintDelta.footprintAfterActions.toFixed(2)}`}
                  </>
                }
              />
            </QuickInfo>
            <QuickInfo
              pt="8"
              icon={
                <HaloIcon
                  icon={BiTargetLock}
                  colorScheme={mapDeltaType(data?.netZeroCalculation.deltaType, 'red', 'green', 'gray')}
                />
              }>
              <QuickInfoLabelDescription
                label={
                  <>
                    {data.netZeroCalculation.deltaType === 'decrease'
                      ? `⬆ ${data.adjustedAchievedGoal} %`
                      : `⬇ ${data.adjustedAchievedGoal} %`}
                  </>
                }
                description={'Net-Zero after fulfilling the action plan.'}
              />
            </QuickInfo>
          </VStack>
        )}
      </InlineErrorDisplay>
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
