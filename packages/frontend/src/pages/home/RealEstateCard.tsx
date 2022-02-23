import {
  AspectRatio,
  Heading,
  IconButton,
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
import { BiImage } from 'react-icons/bi';
import { FaEdit } from 'react-icons/fa';
import { RiDashboardFill, RiSurveyLine, RiMoneyEuroCircleLine } from 'react-icons/ri';
import { GiFootprint } from 'react-icons/gi';
import { MdDeleteForever, MdPendingActions } from 'react-icons/md';
import { RealEstate } from '../../api/realEstate';
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
import CarbonTreeQuickInfo from '../dashboard/global/CarbonTreeQuickInfo';
import CreateRealEstateModal from './CreateRealEstateModal';
import InlineErrorDisplay from '../../components/InlineErrorDisplay';
import { FiMoreHorizontal } from 'react-icons/fi';
import { useAsyncCalculation } from '../../calculations/useAsyncCalculation';
import { Link } from 'react-router-dom';

export interface RealEstateCardProps {
  realEstate: RealEstate;
}

export default function RealEstateCard({ realEstate }: RealEstateCardProps) {
  const [deleteRealEstateMutation] = useDeleteRealEstateMutation();
  const { data: surveyAnswers } = useGetAllSurveyAnswersForRealEstateQuery({ realEstateId: realEstate._id });
  const { data: actionPlans } = useGetAllActionPlansForRealEstateQuery({ realEstateId: realEstate._id });
  const { isOpen: isOpenAlert, onOpen: onOpenAlert, onClose: onCloseAlert } = useDisclosure();
  const { isOpen: isOpenEditModal, onOpen: onOpenEditModal, onClose: onCloseEditModal } = useDisclosure();
  const { data, error } = useAsyncCalculation('getCityCardData', () => [realEstate._id], [realEstate._id]);
  const toast = useToast();

  const carbonFootprint = data?.footprint ?? 0;
  const unitSymbol = carbonFootprint >= 1000 ? 't' : 'kg';
  const adjustedFootprint = carbonFootprint >= 1000 ? carbonFootprint / 1000 : carbonFootprint;

  const onConfirmDelete = async (city) => {
    await deleteRealEstateMutation({ id: city._id });
    toast({
      title: 'City deleted.',
      description: `${city.cityName} has been successfully deleted.`,
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
  };

  return (
    <Card display="flex" flexDir="column" w="xl" h="xl">
      <AspectRatio maxW="100%" ratio={4 / 1.75}>
        <Image src={realEstate.image} fallback={<BiImage />} alt="City Image" objectFit="cover" roundedTop="md" />
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
              <Link to={routes.surveys({ realEstateId: realEstate._id })}>
                <MenuItem icon={<Icon as={RiSurveyLine} />}>Surveys</MenuItem>
              </Link>
              <Link to={routes.realEstateDashboard({ realEstateId: realEstate._id })}>
                <MenuItem icon={<Icon as={RiDashboardFill} />}>New Action Plan</MenuItem>
              </Link>
              <Link to={routes.actionPlans({ realEstateId: realEstate._id })}>
                <MenuItem icon={<Icon as={MdPendingActions} />}>Action Plans</MenuItem>
              </Link>
              <Link to={routes.actionPlansBudgetOverview({ realEstateId: realEstate._id })}>
                <MenuItem icon={<Icon as={RiMoneyEuroCircleLine} />}>Action Plan Budgets</MenuItem>
              </Link>
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

        <SimpleGrid flexGrow={1} alignItems="center" columns={2} p="8" gap={2}>
          <VStack align="flex-start">
            {surveyAnswers && actionPlans ? (
              <>
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
              </>
            ) : (
              <SkeletonText w="100%" noOfLines={9} />
            )}
          </VStack>
          <InlineErrorDisplay error={error}>
            <VStack align="flex-start" spacing="4">
              {!data && <SkeletonText w="100%" noOfLines={9} />}
              {data && (
                <>
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
                  <CarbonTreeQuickInfo carbonFootprint={carbonFootprint} isLoading={false} />
                </>
              )}
            </VStack>
          </InlineErrorDisplay>
        </SimpleGrid>

        <DeleteAlertDialog
          isOpen={isOpenAlert}
          onCancel={onCloseAlert}
          onConfirm={() => onConfirmDelete(realEstate)}
          deleteTextHeader={`Delete ${realEstate.cityName}?`}
          deleteTextDialog={`Are you sure you want to delete ${realEstate.cityName}?`}
        />
        <CreateRealEstateModal isOpen={isOpenEditModal} onClose={onCloseEditModal} realEstate={realEstate} />
      </VStack>
    </Card>
  );
}
