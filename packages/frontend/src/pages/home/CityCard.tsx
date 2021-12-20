import {
  AspectRatio,
  Box,
  Flex,
  Grid,
  Heading,
  HStack,
  IconButton,
  Spacer,
  Tooltip,
  VStack,
  Image,
  Text,
  MenuDivider,
  useDisclosure,
  useToast,
  SkeletonText,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Icon,
  SimpleGrid,
  Portal,
} from '@chakra-ui/react';
import { DataFrame } from 'data-forge';
import { BiImage } from 'react-icons/bi';
import { FaEdit } from 'react-icons/fa';
import { RiDashboardFill, RiSurveyLine } from 'react-icons/ri';
import { GiFootprint } from 'react-icons/gi';
import { MdDeleteForever, MdPendingActions } from 'react-icons/md';
import { useHistory } from 'react-router';
import { ActionAnswerBase } from '../../api/actionAnswer';
import { RealEstate } from '../../api/realEstate';
import { getTransformedFootprintPerYear } from '../../calculations/global/footprint';
import { useCalculation } from '../../calculations/useCalculation';
import Card from '../../components/Card';
import DeleteAlertDialog from '../../components/DeleteAlertDialog';
import HaloIcon from '../../components/HaloIcon';
import { routes } from '../../routes';
import {
  useDeleteRealEstateMutation,
  useGetAllActionPlansForRealEstateQuery,
  useGetAllSurveyAnswersForRealEstateQuery,
} from '../../store/api';
import QuickInfo from '../dashboard/components/QuickInfo';
import QuickInfoLabelDescription from '../dashboard/components/QuickInfoLabelDescription';
import CarbonTreeCard from '../dashboard/global/CarbonTreeCard';
import CreateRealEstateModal from './CreateRealEstateModal';
import InlineErrorDisplay from '../../components/InlineErrorDisplay';
import { FiMoreHorizontal } from 'react-icons/fi';

export interface CityCardProps {
  realEstate: RealEstate;
}

export default function CityCard({ realEstate }: CityCardProps) {
  const [deleteRealEstateMutation] = useDeleteRealEstateMutation();
  const { data: surveyAnswers } = useGetAllSurveyAnswersForRealEstateQuery({ realEstateId: realEstate._id });
  const { data: actionPlans } = useGetAllActionPlansForRealEstateQuery({ realEstateId: realEstate._id });
  const { isOpen: isOpenAlert, onOpen: onOpenAlert, onClose: onCloseAlert } = useDisclosure();
  const { isOpen: isOpenEditModal, onOpen: onOpenEditModal, onClose: onCloseEditModal } = useDisclosure();
  const history = useHistory();
  const toast = useToast();

  const { isLoading, data, error } = useCalculation(
    (externalCalculationData) => {
      const surveyAnswers = externalCalculationData.surveyAnswers.filter(
        (surveyAnswer) => surveyAnswer.realEstateId === realEstate._id,
      );
      // const actionAnswers = externalCalculationData.actionPlans
      //   .filter((actionPlan) => actionPlan.realEstateId === realEstate._id)
      //   .flatMap((actionPlan) => actionPlan.actionAnswers);

      // const allActionAnswers = actionAnswers ? new DataFrame(actionAnswers) : new DataFrame<number, ActionAnswerBase>();

      const footprint =
        surveyAnswers.count() > 0
          ? getTransformedFootprintPerYear(
              externalCalculationData,
              surveyAnswers,
              new DataFrame<number, ActionAnswerBase>(),
            ).globalFootprint
          : 0;

      return {
        footprint,
      };
    },
    [realEstate._id],
  );

  const carbonFootprint = data?.footprint ?? 0;
  const unitSymbol = carbonFootprint >= 1000 ? 't' : 'kg';
  const adjustedFootprint = carbonFootprint >= 1000 ? carbonFootprint / 1000 : carbonFootprint;

  const onConfirm = async (city) => {
    await deleteRealEstateMutation({ id: city._id });
    toast({
      title: 'City deleted.',
      description: `${city.cityName} has been successfully deleted.`,
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
  };

  function goToSurveyOverview(realEstateId: string) {
    history.push(routes.surveys({ realEstateId }));
  }

  function goToDashboard(realEstateId: string) {
    history.push(routes.realEstateDashboard({ realEstateId }));
  }

  function goToActionPlanOverview(realEstateId: string) {
    history.push(routes.actionPlans({ realEstateId }));
  }

  return (
    <Card display="flex" flexDir="column" w="xl" h="xl">
      <AspectRatio maxW="100%" ratio={4 / 1.75}>
        <Image src={realEstate.imageUrl} fallback={<BiImage />} alt="City Image" objectFit="cover" roundedTop="md" />
      </AspectRatio>

      <VStack align="stretch" flexGrow={1} pos="relative">
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
              <MenuItem icon={<Icon as={RiSurveyLine} />} onClick={() => goToSurveyOverview(realEstate._id)}>
                Surveys
              </MenuItem>
              <MenuItem icon={<Icon as={RiDashboardFill} />} onClick={() => goToDashboard(realEstate._id)}>
                Dashboard
              </MenuItem>
              <MenuItem icon={<Icon as={MdPendingActions} />} onClick={() => goToActionPlanOverview(realEstate._id)}>
                Action Plans
              </MenuItem>
              <MenuDivider />
              <MenuItem icon={<Icon as={FaEdit} />} onClick={onOpenEditModal}>
                Edit...
              </MenuItem>
              <MenuItem icon={<Icon as={MdDeleteForever} />} onClick={onOpenAlert}>
                Delete...
              </MenuItem>
            </MenuList>
          </Portal>
        </Menu>

        <VStack spacing="1">
          <Heading as="h4" size="md" fontWeight="semibold" pt="3">
            {realEstate.cityName}
          </Heading>
          <Text fontSize="sm" color="gray.500" textAlign="center" noOfLines={2} isTruncated>
            {realEstate.description ?? 'No description available.'}
          </Text>
        </VStack>

        <SimpleGrid flexGrow={1} align="center" columns={2} p="8">
          <VStack align="flex-start">
            <p>
              <b>Size of the office:</b> {realEstate.area} m<sup>2</sup>
            </p>
            <p>
              <b>Number of employees: </b>
              {realEstate.employees}
            </p>
            <br />
            <br />
            <p>
              <b>Number of surveys: </b>
              {surveyAnswers ? surveyAnswers.length : 0}
            </p>
            <p>
              <b>Number of action plans: </b>
              {actionPlans ? actionPlans.length : 0}
            </p>
          </VStack>
          <VStack align="flex-start" spacing="4">
            <InlineErrorDisplay error={error}>
              {isLoading && <SkeletonText />}
              {data && (
                <QuickInfo icon={<HaloIcon icon={GiFootprint} />}>
                  <QuickInfoLabelDescription
                    label={
                      <>
                        {adjustedFootprint.toFixed(1)}
                        {unitSymbol}
                      </>
                    }
                    description={
                      <>
                        CO<sub>2</sub> produced
                      </>
                    }
                  />
                </QuickInfo>
              )}
            </InlineErrorDisplay>
            <CarbonTreeCard carbonFootprint={carbonFootprint} />
          </VStack>
        </SimpleGrid>

        <DeleteAlertDialog
          isOpen={isOpenAlert}
          onCancel={onCloseAlert}
          onConfirm={() => onConfirm(realEstate)}
          deleteTextHeader={`Delete ${realEstate.cityName}?`}
          deleteTextDialog={`Are you sure you want to delete ${realEstate.cityName}?`}
        />
        <CreateRealEstateModal isOpen={isOpenEditModal} onClose={onCloseEditModal} realEstate={realEstate} />
      </VStack>
    </Card>
  );
}
