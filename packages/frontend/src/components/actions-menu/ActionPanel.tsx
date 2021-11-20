import { Heading, Accordion, VStack } from '@chakra-ui/react';
import groupBy from 'lodash-es/groupBy';
import { SurveyAnswer } from '../../api/surveyAnswer';
import ActionPanelItemSelector from './ActionPanelItemSelector';

export interface ActionPanelProps {
  surveyAnswers: Array<SurveyAnswer> | undefined;
}

export default function ActionPanel({ surveyAnswers }: ActionPanelProps) {
  const groupSurveyAnswers = groupBy(surveyAnswers, 'surveyId');
  return (
    <VStack minW="80%" maxW="80%">
      <Heading as="h3" size="lg" pb="5">
        Take Actions
      </Heading>
      <Accordion minW="100%" allowToggle>
        {Object.entries(groupSurveyAnswers).map(([surveyId, surveyAnswers]) => (
          <ActionPanelItemSelector key={surveyId} surveyId={surveyId} elements={surveyAnswers} />
        ))}
      </Accordion>
    </VStack>
  );
}
