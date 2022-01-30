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
import { useHistory, useParams } from 'react-router';
import { getFootprintDelta } from '../../calculations/global/footprint';
import { useCalculation } from '../../calculations/useCalculation';
import { DataFrame } from 'data-forge';
import { mapDeltaType } from '../../utils/deltaType';
import InlineErrorDisplay from '../../components/InlineErrorDisplay';
import { RiDashboardFill } from 'react-icons/ri';
import { getIlluminationElectricityCostDelta } from '../../calculations/illumination/electricityCost';
import { TiEquals } from 'react-icons/ti';
import { getHeatingCostDelta } from '../../calculations/heating/cost';
import { FiMoreHorizontal } from 'react-icons/fi';
import { CgExport } from 'react-icons/all';

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
        surveyAnswers,
        new DataFrame(currentActionPlan.actionAnswers),
      );
      const netZeroCalculation = getFootprintDelta(
        externalCalculationData,
        surveyAnswers,
        new DataFrame(currentActionPlan.actionAnswers),
      );

      //TODO: Put this in new function which calculates all costs
      const illuminationCosts = getIlluminationElectricityCostDelta(
        externalCalculationData,
        surveyAnswers,
        new DataFrame(currentActionPlan.actionAnswers),
      );

      const heatingCosts = getHeatingCostDelta(
        externalCalculationData,
        surveyAnswers,
        new DataFrame(currentActionPlan.actionAnswers),
      );

      const combinedCosts = heatingCosts.delta + illuminationCosts.delta;

      const delta =
        netZeroCalculation.delta < 0 ? Math.abs(netZeroCalculation.delta) : -Math.abs(netZeroCalculation.delta);
      const achievedGoal = delta / (netZeroCalculation.originalFootprint / 100);
      const adjustedAchievedGoal = achievedGoal > 100 ? 100 : achievedGoal.toFixed(2);

      const carbonFootprint = footPrintDelta ?? 0;
      const unitSymbol = Math.abs(carbonFootprint.delta) >= 1000 ? 't' : 'kg';
      const adjustedFootprint =
        Math.abs(carbonFootprint.delta) >= 1000 ? carbonFootprint.delta / 1000 : carbonFootprint.delta;

      return {
        footPrintDelta,
        adjustedFootprint,
        unitSymbol,
        netZeroCalculation,
        illuminationCosts,
        heatingCosts,
        combinedCosts,
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
            <MenuItem
              icon={<Icon as={RiDashboardFill} />}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                history.push(routes.realEstateDashboard({ realEstateId, actionPlanId: currentActionPlan._id }));
              }}>
              Dashboard
            </MenuItem>
            <MenuItem
              icon={<Icon as={CgExport} />}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                history.push(routes.actionPlanFileExport({ realEstateId, actionPlanId: currentActionPlan._id }));
              }}>
              Export
            </MenuItem>
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
                      colorScheme={mapDeltaType(data.footPrintDelta.deltaType, 'red', 'green', 'gray')}
                    />
                  }>
                  <QuickInfoLabelDescription
                    label={`${Math.abs(data.adjustedFootprint).toFixed(2)}${data.unitSymbol}`}
                    description={
                      <>
                        {data.footPrintDelta.deltaType === 'decrease' ? 'less' : 'more'} CO<sub>2</sub> produced
                      </>
                    }
                  />
                </QuickInfo>
                <QuickInfo
                  icon={
                    <HaloIcon
                      icon={BiTargetLock}
                      colorScheme={mapDeltaType(data?.netZeroCalculation.deltaType, 'red', 'green', 'gray')}
                    />
                  }>
                  <QuickInfoLabelDescription
                    label={<>{`${data.adjustedAchievedGoal}%`}</>}
                    description={
                      <>
                        Net-Zero
                        {data.illuminationCosts.deltaType === 'decrease' ? ` increased ` : ` decreased `}
                        by {data.adjustedAchievedGoal}%
                      </>
                    }
                  />
                </QuickInfo>
                {/* <QuickInfo
              icon={
                <HaloIcon
                  icon={BiEuro}
                  colorScheme={mapDeltaType(data.illuminationCosts.deltaType, 'red', 'green', 'gray')}
                />
              }>
              <QuickInfoLabelDescription
                label={`${Math.abs(data.illuminationCosts.costAfterActions).toFixed(2)}€`}
                description="electricity costs per year"
              />
            </QuickInfo> */}
                <QuickInfo
                  icon={
                    <HaloIcon
                      icon={
                        data.combinedCosts === 0 ? TiEquals : data.combinedCosts > 0 ? BiTrendingUp : BiTrendingDown
                      }
                      colorScheme={mapDeltaType(data!.illuminationCosts.deltaType, 'red', 'green', 'gray')}
                    />
                  }>
                  <QuickInfoLabelDescription
                    label={`${Math.abs(data.combinedCosts).toFixed(2)}€`}
                    description={
                      <>
                        {data.combinedCosts === 0 ? 'equal' : data.combinedCosts < 0 ? 'less ' : 'more '} electricity
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
