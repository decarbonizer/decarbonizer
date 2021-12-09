import { Box, Button, Flex, Grid, GridItem, Stack } from '@chakra-ui/react';
import { useHistory, useParams } from 'react-router';
import { useGetAllBulbsQuery, useGetAllSurveyAnswersForRealEstateQuery } from '../../store/api';
import ComparisonComponent from './ComparisonOfFootprints';
import { RealEstatePageParams, routes } from '../../routes';
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
import DefaultPageLayout from '../../components/DefaultPageLayout';
import Card from '../../components/Card';

export default function DashboardPage() {
  const { realEstateId } = useParams<RealEstatePageParams>();
  const { data: surveyAnswers } = useGetAllSurveyAnswersForRealEstateQuery({ realEstateId: realEstateId });
  const { data: bulbs } = useGetAllBulbsQuery();
  const [filledActionAnswers, setFilledActionAnswers] = useState<FilledActionAnswers>({});
  const history = useHistory();
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
    const value = calculateOverallFootprint(answers, bulbs, 1);
    return +value[0].footprint.toFixed(1);
  }

  return (
    <ActionPanelContext.Provider value={{ filledActionAnswers, setFilledActionAnswers }}>
      <DefaultPageLayout
        title="Dashboard"
        leftArea={
          <Card
            as="aside"
            isStatic
            flexGrow={1}
            w="md"
            borderBottomRadius={0}
            borderLeftRadius={0}
            h="100%"
            px="8"
            py="4"
            size="lg">
            <ActionPanel />
          </Card>
        }>
        <Box w="100%">
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
          {openedActionsCategory === 'illumination' && filledActionAnswers.changeBulbs && (
            <ChangeOfIllumination
              realEstateId={realEstateId}
              bulbId={filledActionAnswers.changeBulbs.values.value.newBulb}
            />
          )}
        </Box>
      </DefaultPageLayout>
    </ActionPanelContext.Provider>
  );
}
