import { Heading, Accordion, VStack } from '@chakra-ui/react';
import { knownActionCategories } from '../../../data/actions/action';
import ActionGroupAccordionItem from './ActionGroupAccordionItem';

export default function ActionPanel() {
  return (
    <VStack align="flex-start" w="100%">
      <Heading as="h2" size="lg" pb="5">
        Take Actions
      </Heading>
      <Accordion minW="100%" allowToggle>
        {knownActionCategories.map((actionCategory, i) => (
          <ActionGroupAccordionItem key={i} actionCategory={actionCategory} />
        ))}
      </Accordion>
    </VStack>
  );
}
