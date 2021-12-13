import { Box, Button, Flex, Grid } from '@chakra-ui/react';
import { useHistory, useParams } from 'react-router';
import { useGetAllBulbsQuery, useGetAllSurveyAnswersForRealEstateQuery } from '../../store/api';
import { RealEstatePageParams, routes } from '../../routes';
import ActionPanel from './action-panel/ActionPanel';
import { useState } from 'react';
import NetZeroCard from './global/NetZeroCard';
import { ActionPanelContext, FilledActionAnswers } from './action-panel/actionPanelContext';
import EmptyState from '../../components/EmptyState';
import cloud from '../../img/cloud.svg';
import DefaultPageLayout from '../../components/DefaultPageLayout';
import ChartSectionHeader from './components/ChartSectionHeader';
import ComparisonCard from './global/ComparisonCard';
import { ActionCategory } from '../../data/actions/action';
import GlobalFootprintCard from './global/GlobalFootprintCard';
import Card from '../../components/Card';
import ActionChartsSection from './ActionChartsSection';
import { Bulb } from '../../api/bulb';
import { SurveyAnswer, calculateOverallFootprint } from '../../api/surveyAnswer';
import MenuNavigation from '../../components/MenuNavigation';

export default function DashboardPage() {
  const { realEstateId } = useParams<RealEstatePageParams>();
  const { data: surveyAnswers } = useGetAllSurveyAnswersForRealEstateQuery({ realEstateId: realEstateId });
  const { data: bulbs } = useGetAllBulbsQuery();
  const [filledActionAnswers, setFilledActionAnswers] = useState<FilledActionAnswers>({});
  const [selectedActionCategory, setSelectedActionCategory] = useState<ActionCategory | undefined>(undefined);
  const history = useHistory();

  if (!surveyAnswers) {
    return null;
  }

  if (surveyAnswers.length === 0) {
    return (
      <EmptyState
        imgSrc={cloud}
        title="Not enough data"
        description="Please fill out a survey to see your consumption, savings and further actions."
        actions={<Button onClick={() => history.push(routes.surveys({ realEstateId }))}>Surveys</Button>}
      />
    );
  }

  return (
    <ActionPanelContext.Provider
      value={{ filledActionAnswers, setFilledActionAnswers, selectedActionCategory, setSelectedActionCategory }}>
      <DefaultPageLayout
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
        <Flex minH="100%" flexDir="column">
          <ChartSectionHeader header="Global" description="How does this real estate compare to others?" mb="4" />
          <Grid templateColumns="repeat(4, 1fr)" gap={6}>
            <GlobalFootprintCard />
            <NetZeroCard
              startCarbonFootprint={surveyAnswers && bulbs ? getFootprint(surveyAnswers, bulbs) : 0}
              reducedValue={1000}
            />
            <ComparisonCard gridColumn="3 / span 2" />
          </Grid>
          {selectedActionCategory && (
            <>
              <ChartSectionHeader
                header="Action Impact"
                description="What impact do your currently visible actions to the left have?"
                mt="8"
                mb="4"
              />
              <Box flexGrow={1} mb="8" display="flex" alignItems="stretch">
                <ActionChartsSection />
              </Box>
            </>
          )}
        </Flex>
      </DefaultPageLayout>
    </ActionPanelContext.Provider>
  );
}

function getFootprint(answers: SurveyAnswer<object>[], bulbs: Bulb[]): number {
  const value = calculateOverallFootprint(answers, bulbs, 1);
  return +value[0].footprint.toFixed(1);
}
