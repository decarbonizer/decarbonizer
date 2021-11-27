import { Box, Button, Flex, Grid, GridItem, Heading, Stack } from '@chakra-ui/react';
import { useParams } from 'react-router';
import { useGetAllSurveyAnswersForRealEstateQuery, useGetAllRealEstatesQuery, useGetAllBulbsQuery } from '../../store/api';
import CarbonFootprintComponent from './CarbonFootprint';
import ComparisonComponent from './Comparison';
import { NetZeroComponent } from './NetZero';
import { DashboardPageParams } from '../../routes';
import ActionPanel from '../../components/actions-menu/ActionPanel';
import React, { useMemo } from 'react';
import { calculateOverallFootprint, SurveyAnswer } from '../../api/surveyAnswer';
import { Bulb } from '../../api/bulb';
import ChangeOfIllumination from './illumination/ChangeOfIllumination';

export default function DashboardPage() {
  const { realEstateId } = useParams<DashboardPageParams>();
  const { isLoading: isLoadingSurveyAnswers, data: surveyAnswers } = useGetAllSurveyAnswersForRealEstateQuery({
    realEstateId: realEstateId,
  });

  const { isLoading: isLoadingRealEstates, data: realEstates } = useGetAllRealEstatesQuery();
  const { isLoading: isLoadingBulbs, data: bulbs } = useGetAllBulbsQuery();

  const cityName = realEstates?.find((realEstate) => realEstate._id === realEstateId)?.cityName ?? '';
  const [openedActionsCategory, setOpenedActionsCategory] = React.useState('illumination');

  const [chosenAction, setChosenAction] = React.useState('');
  
  const carbonFootprint = useMemo(() => surveyAnswers && bulbs? getFootprint(surveyAnswers, bulbs) : 0, [surveyAnswers, bulbs]);

  function getFootprint(answers: SurveyAnswer<object>[], bulbs: Bulb[]) : number {
    const value = calculateOverallFootprint(answers, bulbs);
      return +value.overallFootprint.toFixed(1);
  }

  const onChangeActionsCategory = (value: string) => {
    //TODO display illumination data only when illumination is chosen
    setOpenedActionsCategory(value);
  };

  function onChangeChosenAction(value: string) {
    setChosenAction(value);
  }

  return (
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
        <ActionPanel surveyAnswers={surveyAnswers} chosenAction={chosenAction} onChangeChosenAction={onChangeChosenAction}/>
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
              <CarbonFootprintComponent heading={"Calculated footprint"} carbonFootprint={carbonFootprint} />
            </GridItem>
            <GridItem rowSpan={1} w="80">
              <NetZeroComponent />
            </GridItem>
          </Grid>
        </Stack>
        {openedActionsCategory === 'illumination' && chosenAction != '' && ( <ChangeOfIllumination realEstateId={realEstateId} bulbId={chosenAction}/>)}     
      </Box>
    </Flex>
  );
}
