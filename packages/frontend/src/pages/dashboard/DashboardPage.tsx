import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Badge,
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
  Spacer,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import PopUp, { PopUpSchema } from './pop-up/PopUp';
import { useParams } from 'react-router';
import {
  useGetAllBulbsQuery,
  useGetAllRealEstatesQuery,
  useGetAllSurveyAnswersForRealEstateQuery,
} from '../../store/api';
import CarbonFootprintComponent from './CarbonFootprint';
import ComparisonComponent from './ComparisonOfFootprints';
import { DashboardPageParams } from '../../routes';
import ActionPanel from '../../components/actions-menu/ActionPanel';
import React, { useMemo, useState } from 'react';
import { calculateOverallFootprint, SurveyAnswer } from '../../api/surveyAnswer';
import { Bulb } from '../../api/bulb';
import { PopUpContext } from './pop-up/PopUpContext';
import { FormSchema } from '../../form-engine/formSchema';
import NetZeroCard from './NetZeroCard';
import ChangeOfIllumination from './illumination/ChangeOfIllumination';
import { ActionPlanContext } from '../action-plan/ActionPlanContext';
import FormEngine from '../../form-engine/FormEngine';
import { IoBulbOutline } from 'react-icons/io5';
import { useFormEngine } from '../../form-engine/useFormEngine';
import { FormLabel } from '@chakra-ui/form-control';

const schemaActionPage: FormSchema = {
  pages: [
    {
      elements: [
        { id: 'projectName', required: false, label: 'New project', type: 'string', placeholder: 'Project Name' },
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
  const [schema, setSchema] = useState<PopUpSchema>(null!);
  const [actionValue, setActionValue] = useState<Record<string, any>>({});

  const cityName = realEstates?.find((realEstate) => realEstate._id === realEstateId)?.cityName ?? '';
  const openedActionsCategory = 'illumination';

  const carbonFootprint = useMemo(
    () => (surveyAnswers && bulbs ? getFootprint(surveyAnswers, bulbs) : 0),
    [surveyAnswers, bulbs],
  );

  function getFootprint(answers: SurveyAnswer<object>[], bulbs: Bulb[]): number {
    const value = calculateOverallFootprint(answers, bulbs);
    return +value.overallFootprint.toFixed(1);
  }

  function onChangeChosenAction(value: string) {
    setActionValue({ ...actionValue, illumination: value });
  }

  const { value, page, ruleEvaluationResults, validationErrors, verifySubmit, handleValueChanged, setValue } =
    useFormEngine(schemaActionPage);

  return (
    <PopUpContext.Provider
      value={{
        onOpen: (schema: PopUpSchema) => {
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
              chosenAction={actionValue.illumination}
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
            {openedActionsCategory === 'illumination' && actionValue.illumination && (
              <ChangeOfIllumination realEstateId={realEstateId} bulbId={actionValue.illumination} />
            )}
          </Box>
          {schema ? (
            <PopUp
              isOpen={popUpActions.isOpen}
              onClose={(value) => {
                setActionValue({ ...actionValue, [schema]: value });
                popUpActions.onClose();
              }}
              schema={schema}
              initialValue={actionValue[schema]}
            />
          ) : null}
        </Flex>
        <Modal
          isOpen={popUpActionPlan.isOpen}
          onClose={() => {
            setValue({});
            popUpActionPlan.onClose();
          }}
          size={'xl'}>
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
                {actionValue.illumination ? (
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
                        <Flex align="center">
                          <Checkbox defaultIsChecked>
                            {actionValue.illumination === '00000000-0000-0000-0000-000000000003'
                              ? 'LED 800 lum'
                              : 'LED 1300 lum'}
                          </Checkbox>
                          <PriorityBadge priority={actionValue?.led?.choosePriority} />
                          <Spacer />
                          {actionValue?.led?.chooseTimePeriod?.startDate &&
                          actionValue?.led?.chooseTimePeriod?.endDate ? (
                            <Text color="gray.500">
                              {actionValue?.led?.chooseTimePeriod?.startDate?.toDateString()} -{' '}
                              {actionValue?.led?.chooseTimePeriod?.endDate?.toDateString()}
                            </Text>
                          ) : null}
                        </Flex>
                      </Text>
                    </AccordionPanel>
                  </AccordionItem>
                ) : (
                  <Text pb="5">No actions selected</Text>
                )}
              </Accordion>
            </ModalBody>
            <ModalFooter>
              <Grid templateColumns="repeat(5, 1fr)" gap={4} paddingTop={4}>
                <GridItem colSpan={2} colStart={2}>
                  <Button
                    onClick={() => {
                      setValue({});
                      popUpActionPlan.onClose();
                    }}
                    width="40"
                    colorScheme="gray">
                    Cancel
                  </Button>
                </GridItem>
                <GridItem colStart={4} colEnd={6}>
                  <Button
                    onClick={() => {
                      // TODO: create project
                      if (verifySubmit()) {
                        console.log('Saving actions');
                        popUpActionPlan.onClose();
                      }
                    }}
                    position="absolute"
                    width="40"
                    right="6"
                    colorScheme="green">
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

function PriorityBadge({ priority }: { priority?: 'low' | 'medium' | 'high' }) {
  switch (priority) {
    case 'low':
      return (
        <Badge variant="outline" colorScheme="green" ml={1}>
          Low
        </Badge>
      );
    case 'medium':
      return (
        <Badge variant="subtle" colorScheme="green" ml={1}>
          Medium
        </Badge>
      );
    case 'high':
      return (
        <Badge variant="solid" colorScheme="green" ml={1}>
          High
        </Badge>
      );
    default:
      return null;
  }
}
