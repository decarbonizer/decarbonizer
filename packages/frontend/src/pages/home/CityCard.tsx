import {
  AspectRatio,
  Box,
  Button,
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
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { DataFrame } from 'data-forge';
import { AiOutlineArrowRight } from 'react-icons/ai';
import { BiImage } from 'react-icons/bi';
import { FaEdit } from 'react-icons/fa';
import { GiFootprint } from 'react-icons/gi';
import { MdDeleteForever } from 'react-icons/md';
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
  useGetAllBulbsQuery,
  useGetAllSurveyAnswersForRealEstateQuery,
} from '../../store/api';
import QuickInfo from '../dashboard/components/QuickInfo';
import QuickInfoLabelDescription from '../dashboard/components/QuickInfoLabelDescription';
import CarbonTreeCard from '../dashboard/global/CarbonTreeCard';
import GlobalFootprintCard from '../dashboard/global/GlobalFootprintCard';
import CreateRealEstateModal from './CreateRealEstateModal';

export interface CityCardProps {
  realEstate: RealEstate;
}

export default function CityCard({ realEstate }: CityCardProps) {
  const [deleteRealEstateMutation] = useDeleteRealEstateMutation();
  const { data: surveyAnswers } = useGetAllSurveyAnswersForRealEstateQuery({ realEstateId: realEstate._id });
  const { data: actionPlans } = useGetAllActionPlansForRealEstateQuery({ realEstateId: realEstate._id });
  const { data: bulbs } = useGetAllBulbsQuery();
  const { isOpen: isOpenAlert, onOpen: onOpenAlert, onClose: onCloseAlert } = useDisclosure();
  const { isOpen: isOpenEditModal, onOpen: onOpenEditModal, onClose: onCloseEditModal } = useDisclosure();
  const history = useHistory();
  const toast = useToast();

  const { isLoading, data, error } = useCalculation(
    (externalCalculationData) => {
      const surveyAnswers = externalCalculationData.surveyAnswers.filter(
        (surveyAnswer) => surveyAnswer.realEstateId === realEstate._id,
      );

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

  function startSurvey(realEstateId: string) {
    history.push(routes.surveys({ realEstateId }));
  }

  function goToDashboard(realEstateId: string) {
    history.push(routes.realEstateDashboard({ realEstateId }));
  }

  return (
    <Card pos="relative" display="flex" flexDir="column" w="xl" h="xl">
      <AspectRatio maxW="100%" ratio={4 / 1.75}>
        <Image
          src={realEstate.imageUrl}
          // fallbackSrc="https://via.placeholder.com/150"
          fallback={<BiImage />}
          alt="City Image"
          objectFit="cover"
          roundedTop="md"
        />
      </AspectRatio>
      <VStack>
        <Grid templateColumns="repeat(3,1fr)" gap={2} w="100%">
          <Flex gridColumnStart="2" w="100%" justifyContent="center">
            <Heading as="h4" size="md" fontWeight="semibold" pt="3">
              {realEstate.cityName}
            </Heading>
          </Flex>
          <Flex gridColumnStart="3" w="100%" justifyContent="flex-end" pr="2" pt="1">
            <Tooltip label="Edit City" hasArrow>
              <IconButton aria-label="edit" icon={<FaEdit />} mr="1" onClick={onOpenEditModal} />
            </Tooltip>
            <Tooltip label="Delete City" hasArrow>
              <IconButton aria-label="delete" fontSize="21" icon={<MdDeleteForever />} onClick={onOpenAlert} />
            </Tooltip>
          </Flex>
        </Grid>
        <Text fontSize="sm" color="gray.500" textAlign="center">
          {realEstate.description ?? 'No description available.'}
        </Text>
        <Grid templateColumns="repeat(2,1fr)" pt="3" gap={4} w="95%" h="auto">
          <Box borderColor="black" pl="2">
            <p>
              <b>Size of the office:</b> {realEstate.area} m<sup>2</sup>
            </p>
            <p>
              <b>Number of employees: </b>
              {realEstate.employees}
            </p>
            <Box pt="5">
              <p>
                <b>Number of surveys: </b>
                {surveyAnswers ? surveyAnswers.length : 0}
              </p>
              <p>
                <b>Number of action plans: </b>
                {actionPlans ? actionPlans.length : 0}
              </p>
              <QuickInfo h="50%" icon={<HaloIcon icon={GiFootprint} />} pt="5">
                <QuickInfoLabelDescription
                  label={
                    <>
                      {adjustedFootprint.toFixed(1)}
                      {unitSymbol}
                    </>
                  }
                />
              </QuickInfo>
            </Box>
          </Box>
          <CarbonTreeCard carbonFootprint={carbonFootprint} />
        </Grid>

        <Flex position="absolute" bottom="5" right="4">
          <HStack>
            <Button
              rightIcon={<AiOutlineArrowRight />}
              colorScheme="green"
              size="sm"
              onClick={() => goToDashboard(realEstate._id)}>
              Dashboard
            </Button>
            <Spacer />
            <Button
              rightIcon={<AiOutlineArrowRight />}
              colorScheme="green"
              size="sm"
              onClick={() => startSurvey(realEstate._id)}>
              Survey Overview
            </Button>
          </HStack>
        </Flex>
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
