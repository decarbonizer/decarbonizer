import { Button, Flex, HStack, SimpleGrid } from '@chakra-ui/react';
import { useHistory, useParams } from 'react-router';
import { useGetAllSurveyAnswersForRealEstateQuery } from '../../store/api';
import { RealEstatePageParams, routes } from '../../routes';
import ActionPanel from './action-panel/ActionPanel';
import { useState } from 'react';
import { ActionPanelContext, FilledActionAnswers } from './action-panel/actionPanelContext';
import EmptyState from '../../components/EmptyState';
import cloud from '../../img/cloud.svg';
import DefaultPageLayout from '../../components/DefaultPageLayout';
import { ActionCategory } from '../../data/actions/action';
import Card from '../../components/Card';
import DashboardCharts from './DashboardCharts';

export default function DashboardPage() {
  const { realEstateId } = useParams<RealEstatePageParams>();
  const { data: surveyAnswers } = useGetAllSurveyAnswersForRealEstateQuery({ realEstateId: realEstateId });
  const [filledActionAnswers, setFilledActionAnswers] = useState<FilledActionAnswers>({});
  const [selectedActionCategory, setSelectedActionCategory] = useState<ActionCategory | undefined>(undefined);
  const history = useHistory();
  const isNarrow = true;

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
      value={{
        filledActionAnswers,
        setFilledActionAnswers,
        selectedActionCategory,
        setSelectedActionCategory,
      }}>
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
        <SimpleGrid spacing="8" columns={isNarrow ? 2 : 1}>
          <Flex minH="100%" flexDir="column">
            <DashboardCharts selectedActionCategory={selectedActionCategory} isNarrow={isNarrow} showHeaders={true} />
          </Flex>
          {isNarrow && (
            <Flex minH="100%" flexDir="column">
              <DashboardCharts
                selectedActionCategory={selectedActionCategory}
                isNarrow={isNarrow}
                showHeaders={false}
              />
            </Flex>
          )}
        </SimpleGrid>
      </DefaultPageLayout>
    </ActionPanelContext.Provider>
  );
}
