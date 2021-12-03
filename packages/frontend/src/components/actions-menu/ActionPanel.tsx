import { Heading, Accordion, VStack, AccordionItem, AccordionPanel, Icon } from '@chakra-ui/react';
import { SurveyAnswer } from '../../api/surveyAnswer';
import { knownActionCategories } from '../../data/actions/action';
import ActionPanelAccordionButton from './ActionPanelAccordionButton';
import { ActionAccordionItem } from './ActionAccordionItem';

export interface ActionPanelProps {
  surveyAnswers: Array<SurveyAnswer> | undefined;
  chosenAction: string;
  onChangeChosenAction: (value: string) => void;
}

export default function ActionPanel({ surveyAnswers, chosenAction, onChangeChosenAction }: ActionPanelProps) {
  return (
    <VStack minW="80%" maxW="80%" align="flex-start">
      <Heading as="h2" size="lg" pb="5">
        Take Actions
      </Heading>
      <Accordion minW="100%" allowToggle>
        {knownActionCategories.map((actionCategory) => (
          <AccordionItem key={actionCategory.forSurvey} maxW="100%">
            <ActionPanelAccordionButton icon={<Icon as={actionCategory.icon} />} title={actionCategory.name} />
            <AccordionPanel pr="0">
              <Accordion allowToggle>
                {actionCategory.actions.map((action) => (
                  <ActionAccordionItem key={action.id} action={action} />
                ))}
              </Accordion>
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </VStack>
  );
}
