import { Heading, Accordion, VStack, useDisclosure, HStack, Spacer, IconButton, Icon, Tooltip } from '@chakra-ui/react';
import { useContext } from 'react';
import { knownActionCategories } from '../../../data/actions/action';
import ActionGroupAccordionItem from './ActionGroupAccordionItem';
import { DashboardContext } from '../dashboardContext';
import isEmpty from 'lodash-es/isEmpty';
import SaveActionPlanModal from './SaveActionPlanModal';
import { FaSave } from 'react-icons/fa';
import { RealEstatePageParams, routes } from '../../../routes';
import { useHistory, useParams } from 'react-router';
import { FcDataConfiguration } from 'react-icons/fc';
import BaseDataModal from '../../../components/BaseDataModal';

export default function ActionPanel() {
  const saveActionPlanDisclosure = useDisclosure();
  const baseDataDisclosure = useDisclosure();
  const { actionPlanToEdit, filledActionAnswers, setSelectedActionCategory } = useContext(DashboardContext);
  const canSaveActionPlan = Object.values(filledActionAnswers).filter((x) => !isEmpty(x)).length > 0;
  const history = useHistory();
  const { realEstateId } = useParams<RealEstatePageParams>();

  return (
    <VStack align="stretch" w="100%">
      <HStack pb="5">
        <Heading as="h2" size="lg" isTruncated>
          {actionPlanToEdit?.name ?? 'New action plan'}
        </Heading>
        <Spacer />
        <Tooltip label="Base Data">
          <IconButton
            aria-label="Base Data"
            onClick={baseDataDisclosure.onOpen}
            variant="outline"
            icon={<FcDataConfiguration size="20" />}
          />
        </Tooltip>
        <Tooltip label="Save action plan">
          <IconButton
            icon={<Icon as={FaSave} />}
            colorScheme="primary"
            aria-label="Save"
            isDisabled={!canSaveActionPlan}
            onClick={saveActionPlanDisclosure.onOpen}
          />
        </Tooltip>
      </HStack>
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
      <BaseDataModal isOpen={baseDataDisclosure.isOpen} onClose={baseDataDisclosure.onClose} />
      {saveActionPlanDisclosure.isOpen && (
        <SaveActionPlanModal
          isOpen
          onClose={() => {
            saveActionPlanDisclosure.onClose();
            history.push(routes.actionPlans({ realEstateId }));
          }}
          actionAnswers={Object.values(filledActionAnswers).filter(Boolean)}
          actionPlan={actionPlanToEdit}
        />
      )}
    </VStack>
  );
}
