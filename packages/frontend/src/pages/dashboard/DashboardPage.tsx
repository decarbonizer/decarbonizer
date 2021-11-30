import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Checkbox,
  Flex,
  Grid,
  GridItem,
  Heading,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import PopUp from './pop-up/PopUp';
import { useParams } from 'react-router';
import {
  useGetAllSurveyAnswersForRealEstateQuery,
  useGetAllRealEstatesQuery,
  useGetAllBulbsQuery,
} from '../../store/api';
import { useHistory, useParams } from 'react-router';
import IlluminationOverviewComponent from './illumination/IlluminationOverview';
import { useGetAllRealEstatesQuery, useGetAllSurveyAnswersForRealEstateQuery } from '../../store/api';
import CarbonFootprintComponent from './CarbonFootprint';
import ComparisonComponent from './ComparisonOfFootprints';
import { DashboardPageParams } from '../../routes';
import ActionPanel from '../../components/actions-menu/ActionPanel';
import React, { useMemo } from 'react';
import { calculateOverallFootprint, SurveyAnswer } from '../../api/surveyAnswer';
import { Bulb } from '../../api/bulb';
import { PopUpContext } from './pop-up/PopUpContext';
import { FormSchema } from '../../form-engine/formSchema';
import { useState } from 'react';
import NetZeroCard from './NetZeroCard';
import ChangeOfIllumination from './illumination/ChangeOfIllumination';
import { ActionPlanContext } from '../action-plan/ActionPlanContext';
import FormEngine from '../../form-engine/FormEngine';
import { IoBulbOutline } from 'react-icons/io5';
import { Input } from '@chakra-ui/input';
import { useFormEngine } from '../../form-engine/useFormEngine';
import ActionPanelItemSelector from '../../components/actions-menu/ActionPanelItemSelector';
import { RiCarLine, RiDatabaseLine } from 'react-icons/ri';
import { MdOutlineAir, MdOutlineKitchen } from 'react-icons/md';
import { GiCommercialAirplane, GiHeatHaze } from 'react-icons/gi';
import { BiBuildingHouse } from 'react-icons/bi';
import { HiOutlineVideoCamera } from 'react-icons/hi';
import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { VStack } from '@chakra-ui/layout';

const schemaActionPage: FormSchema = {
  pages: [
    {
      elements: [
        { id: 'projectName', required: false, label: 'New project', type: 'string' },
        { id: 'chooseTimePeriod', required: false, label: 'Choose time period', type: 'dates' },
      ],
    },
  ],
};

export default function DashboardPage() {
  const { realEstateId } = useParams<DashboardPageParams>();
  const popUpActions = useDisclosure();
  const popUpActionPlan = useDisclosure();

  const { data: surveyAnswers } = useGetAllSurveyAnswersForRealEstateQuery({ realEstateId: realEstateId });
  const { data: realEstates } = useGetAllRealEstatesQuery();
  const { data: bulbs } = useGetAllBulbsQuery();
  const [schema, setSchema] = useState<FormSchema>(null!);
  const [actionValue, setActionValue] = useState<Record<string, any>>({});

  const cityName = realEstates?.find((realEstate) => realEstate._id === realEstateId)?.cityName ?? '';
  const openedActionsCategory = 'illumination';

  const [chosenAction, setChosenAction] = React.useState('');

  const carbonFootprint = useMemo(
    () => (surveyAnswers && bulbs ? getFootprint(surveyAnswers, bulbs) : 0),
    [surveyAnswers, bulbs],
  );

  function getFootprint(answers: SurveyAnswer<object>[], bulbs: Bulb[]): number {
    const value = calculateOverallFootprint(answers, bulbs);
    return +value.overallFootprint.toFixed(1);
  }

  function onChangeChosenAction(value: string) {
    setChosenAction(value);
  }

  const { value, page, ruleEvaluationResults, validationErrors, verifySubmit, handleValueChanged } =
    useFormEngine(schemaActionPage);

  return (
    <PopUpContext.Provider
      value={{
        onOpen: (schema: FormSchema) => {
          setSchema(schema);
          popUpActions.onOpen();
        },
      }}>
      <ActionPlanContext.Provider value={{ actionValue: actionValue, setActionValue: setActionValue }}>
        <Flex minH="100%">
          <Flex
            as="aside"
            direction="column"
            justify="flex-start"
            align="center"
            pos="sticky"
            minW="350"
            maxW="350"
            paddingTop="8"
            paddingBottom="8"
            bg="gray.50"
            border="1px"
            borderColor="gray.200"
            shadow="xl"
            zIndex="100">
            <Heading as="h3" color="darkgreen" pb={10}>
              Decarbonizer
            </Heading>
            <ActionPanel
              surveyAnswers={surveyAnswers}
              chosenAction={chosenAction}
              onChangeChosenAction={onChangeChosenAction}
            />
            <Box w="100%" pt="14" align="right" pr="5">
              <Button
                colorScheme="primary"
                onClick={() => {
                  popUpActionPlan.onOpen();
                }}>
                Save Actions
              </Button>
            </Box>
          </Flex>
          <Box w="100%" grow={1}>
            <Stack align="center">
              <Heading as="h1">Dashboard</Heading>
              <Heading as="h2" size="lg">
                {cityName}
              </Heading>
              <Heading as="h2" size="lg" color="green">
                Calculating your footprint...
              </Heading>
              <Grid templateColumns="repeat(2, 2fr)" templateRows="repeat(2, 2fr)" gap={6} p="4">
                <GridItem rowSpan={2} colSpan={1}>
                  <ComparisonComponent />
                </GridItem>
                <GridItem rowSpan={1} w="80">
                  <CarbonFootprintComponent heading={'Calculated footprint'} carbonFootprint={carbonFootprint} />
                </GridItem>
                <GridItem rowSpan={1} w="80">
                  <NetZeroCard />
                </GridItem>
              </Grid>
            </Stack>
            {openedActionsCategory === 'illumination' && chosenAction != '' && (
              <ChangeOfIllumination realEstateId={realEstateId} bulbId={chosenAction} />
            )}
          </Box>
          <PopUp isOpen={popUpActions.isOpen} onClose={popUpActions.onClose} schema={schema} />
        </Flex>
        <Modal isOpen={popUpActionPlan.isOpen} onClose={popUpActionPlan.onClose} size={'xl'}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Action Plan ({cityName})</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormEngine
                schema={schemaActionPage}
                value={value}
                page={page}
                ruleEvaluationResults={ruleEvaluationResults}
                validationErrors={validationErrors}
                onValueChanged={handleValueChanged}
              />

              <FormLabel fontWeight="semibold" mt={8}>
                Selected Actions
              </FormLabel>

              <Accordion minW="100%" allowToggle allowMultiple defaultIndex={[0]}>
                <AccordionItem>
                  <h2>
                    <AccordionButton _expanded={{ bg: 'gray.50' }}>
                      <Box flex="1" textAlign="left">
                        <Icon as={IoBulbOutline} /> Illumination
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel>
                    <Text pb="5">
                      {actionValue.illumination !== '' ? (
                        <>
                          <Checkbox defaultIsChecked>
                            {actionValue.illumination === '00000000-0000-0000-0000-000000000003'
                              ? 'LED 800 lum'
                              : 'LED 1300 lum'}
                          </Checkbox>
                        </>
                      ) : (
                        ''
                      )}
                    </Text>
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            </ModalBody>
            <ModalFooter>
              <Grid templateColumns="repeat(5, 1fr)" gap={4} paddingTop={4}>
                <GridItem colSpan={2}>
                  <Button onClick={popUpActionPlan.onClose} width="40" colorScheme="gray">
                    Cancel
                  </Button>
                </GridItem>
                <GridItem colStart={4} colEnd={6}>
                  <Button position="absolute" width="40" right="6" colorScheme="green">
                    Save
                  </Button>
                </GridItem>
              </Grid>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </ActionPlanContext.Provider>
    </PopUpContext.Provider>
  );
}
