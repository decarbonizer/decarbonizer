import { Box, Button, Flex, Grid, GridItem, Heading, Stack } from '@chakra-ui/react';
import { useHistory, useParams } from 'react-router';
import {
  useGetAllBulbsQuery,
  useGetAllRealEstatesQuery,
  useGetAllSurveyAnswersForRealEstateQuery,
} from '../../store/api';
import ComparisonComponent from './ComparisonOfFootprints';
import { DashboardPageParams, routes } from '../../routes';
import ActionPanel from './action-panel/ActionPanel';
import { useMemo, useState } from 'react';
import { calculateOverallFootprint, SurveyAnswer } from '../../api/surveyAnswer';
import { Bulb } from '../../api/bulb';
import NetZeroCard from './NetZeroCard';
import ChangeOfIllumination from './illumination/ChangeOfIllumination';
import { ActionPanelContext, FilledActionAnswers } from './action-panel/actionPanelContext';
import EmptyState from '../../components/EmptyState';
import cloud from '../../img/cloud.svg';
import CarbonFootprintCard from './shared/CarbonFootprintCard';

export default function DashboardPage() {
  const { realEstateId } = useParams<DashboardPageParams>();
  const { data: surveyAnswers } = useGetAllSurveyAnswersForRealEstateQuery({ realEstateId: realEstateId });
  const { data: realEstates } = useGetAllRealEstatesQuery();
  const { data: bulbs } = useGetAllBulbsQuery();
  const [filledActionAnswers, setFilledActionAnswers] = useState<FilledActionAnswers>({});
  const history = useHistory();
  const cityName = realEstates?.find((realEstate) => realEstate._id === realEstateId)?.cityName ?? '';
  const openedActionsCategory = 'illumination';
  const carbonFootprint = useMemo(
    () => (surveyAnswers && bulbs ? getFootprint(surveyAnswers, bulbs) : 0),
    [surveyAnswers, bulbs],
  );

  if (!surveyAnswers) {
    return null;
  }

  if (surveyAnswers.length === 0) {
    return (
      <EmptyState
        imgSrc={cloud}
        title={'Not enough data'}
        description={'Please fill out a survey to see your consumption, savings and further actions.'}
        actions={
          <Button
            onClick={() => {
              history.push(routes.surveys({ realEstateId }));
            }}>
            Surveys
          </Button>
        }
      />
    );
  }

  function getFootprint(answers: SurveyAnswer<object>[], bulbs: Bulb[]): number {
    const value = calculateOverallFootprint(answers, bulbs);
    return +value.overallFootprint.toFixed(1);
  }

  return (
    <ActionPanelContext.Provider value={{ filledActionAnswers, setFilledActionAnswers }}>
      <Flex h="100%">
        <Flex
          as="aside"
          direction="column"
          justify="flex-start"
          align="center"
          pos="sticky"
          minW="450"
          maxW="450"
          h="100%"
          px="4"
          py="8"
          bg="gray.50"
          border="1px"
          borderColor="gray.200"
          shadow="xl"
          zIndex="100">
          <ActionPanel />
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
                <CarbonFootprintCard heading={'Calculated footprint'} carbonFootprint={carbonFootprint} />
              </GridItem>
              <GridItem rowSpan={1} w="80">
                <NetZeroCard />
              </GridItem>
            </Grid>
          </Stack>
          {openedActionsCategory === 'illumination' && filledActionAnswers.changeBulbs && (
            <ChangeOfIllumination
              realEstateId={realEstateId}
              bulbId={filledActionAnswers.changeBulbs.values.value.newBulb}
            />
          )}
        </Box>
      </Flex>
    </ActionPanelContext.Provider>
  );
}
