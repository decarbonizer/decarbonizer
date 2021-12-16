import { Heading, Accordion, VStack, Button, useDisclosure } from '@chakra-ui/react';
import { useContext } from 'react';
import { knownActionCategories } from '../../../data/actions/action';
import ActionGroupAccordionItem from './ActionGroupAccordionItem';
import { DashboardContext } from '../dashboardContext';
import isEmpty from 'lodash-es/isEmpty';
import SaveActionPlanModal from './SaveActionPlanModal';
import { useGetRealEstateQuery } from '../../../store/api';
import { useParams } from 'react-router';
import { RealEstatePageParams } from '../../../routes';

export default function ActionPanel() {
  const saveActionPlanDisclosure = useDisclosure();
  const { filledActionAnswers, setSelectedActionCategory } = useContext(DashboardContext);
  const canSaveActionPlan = Object.values(filledActionAnswers).filter((x) => !isEmpty(x)).length > 0;
  const { data: currentRealEstate } = useGetRealEstateQuery({ id: useParams<RealEstatePageParams>().realEstateId });

  return (
    <VStack align="flex-start" w="100%">
      <Heading as="h2" size="lg" pb="5" isTruncated>
        {currentRealEstate?.cityName}
      </Heading>
      <Accordion
        minW="100%"
        allowToggle
        onChange={(expandedIndex: number) => {
          setSelectedActionCategory(expandedIndex === -1 ? undefined : knownActionCategories[expandedIndex]);
        }}>
        {knownActionCategories.map((actionCategory, i) => (
          <ActionGroupAccordionItem key={i} actionCategory={actionCategory} />
        ))}
      </Accordion>
      <Button colorScheme="primary" isDisabled={!canSaveActionPlan} onClick={saveActionPlanDisclosure.onOpen}>
        Save Actions
      </Button>
      {saveActionPlanDisclosure.isOpen && (
        <SaveActionPlanModal
          isOpen
          onClose={saveActionPlanDisclosure.onClose}
          actionAnswers={Object.values(filledActionAnswers).filter(Boolean)}
        />
      )}
    </VStack>
  );
}
