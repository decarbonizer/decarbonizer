import { Heading, Accordion, VStack, AccordionItem, AccordionPanel, Icon } from '@chakra-ui/react';
import ActionPanelAccordionButton from './ActionPanelAccordionButton';
import { ActionAccordionItem } from './ActionAccordionItem';
import { knownActionCategories } from '../../../data/actions/action';

export default function ActionPanel() {
  return (
    <VStack align="flex-start" w="100%">
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
