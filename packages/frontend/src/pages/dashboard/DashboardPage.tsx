import { Box, Button, Flex, Grid, GridItem, Heading, Stack, useDisclosure } from '@chakra-ui/react';
import PopUp from './pop-up/PopUp';
import { useParams } from 'react-router';
import {
  useGetAllSurveyAnswersForRealEstateQuery,
  useGetAllRealEstatesQuery,
  useGetAllBulbsQuery,
} from '../../store/api';
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

export default function DashboardPage() {
  const { realEstateId } = useParams<DashboardPageParams>();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { data: surveyAnswers } = useGetAllSurveyAnswersForRealEstateQuery({ realEstateId: realEstateId });
  const { data: realEstates } = useGetAllRealEstatesQuery();
  const { data: bulbs } = useGetAllBulbsQuery();
  const [schema, setSchema] = useState<FormSchema>(null!);

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

  return (
    <PopUpContext.Provider
      value={{
        onOpen: (schema: FormSchema) => {
          setSchema(schema);
          onOpen();
        },
      }}>
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
            <Button colorScheme="primary"> Save Actions</Button>
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
        <PopUp isOpen={isOpen} onClose={onClose} schema={schema} />
      </Flex>
    </PopUpContext.Provider>
  );
}
