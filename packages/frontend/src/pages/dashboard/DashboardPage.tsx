import { Box, Button } from '@chakra-ui/react';
import { useHistory, useParams } from 'react-router';
import { useGetActionPlanQuery, useGetAllSurveyAnswersForRealEstateQuery } from '../../store/api';
import { RealEstateDashboardPageParams, routes } from '../../routes';
import ActionPanel from './action-panel/ActionPanel';
import { useEffect, useState } from 'react';
import { DashboardContext, FilledActionAnswers } from './dashboardContext';
import EmptyState from '../../components/EmptyState';
import cloud from '../../img/cloud.svg';
import DefaultPageLayout from '../../components/DefaultPageLayout';
import { ActionCategory } from '../../data/actions/action';
import Card from '../../components/Card';
import DashboardCharts from './DashboardCharts';

export default function DashboardPage() {
  const { realEstateId, actionPlanId } = useParams<RealEstateDashboardPageParams>();
  const { data: surveyAnswers } = useGetAllSurveyAnswersForRealEstateQuery({ realEstateId: realEstateId });
  const { data: actionPlanToEdit, isFetching: isFetchingActionPlanToEdit } = useGetActionPlanQuery(
    { id: actionPlanId! },
    { skip: !actionPlanId },
  );
  const [filledActionAnswers, setFilledActionAnswers] = useState<FilledActionAnswers>({});
  const [selectedActionCategory, setSelectedActionCategory] = useState<ActionCategory | undefined>(undefined);
  const history = useHistory();

  useEffect(
    function populateFilledActionsFromActionPlan() {
      if (actionPlanToEdit) {
        setFilledActionAnswers(
          actionPlanToEdit.actionAnswers.reduce(
            (acc, actionAnswer) => ({ ...acc, [actionAnswer.actionId]: actionAnswer }),
            {},
          ),
        );
      }
    },
    [actionPlanToEdit],
  );

  if (!surveyAnswers || isFetchingActionPlanToEdit) {
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
    <DashboardContext.Provider
      value={{
        actionPlanToEdit,
        filledActionAnswers,
        setFilledActionAnswers,
        selectedActionCategory,
        setSelectedActionCategory,
      }}>
      <DefaultPageLayout
        leftArea={
          <Box position="sticky" top="5rem">
            <Card
              as="aside"
              isStatic
              flexGrow={1}
              w="md"
              borderBottomRadius={0}
              borderLeftRadius={0}
              h="calc(100vh - 5rem)"
              px="8"
              py="4"
              size="lg">
              <ActionPanel />
            </Card>
          </Box>
        }>
        <DashboardCharts selectedActionCategory={selectedActionCategory} />
      </DefaultPageLayout>
    </DashboardContext.Provider>
  );
}
