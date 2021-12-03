import { Accordion, AccordionItem, AccordionPanel, Tag, Icon } from '@chakra-ui/react';
import { useContext } from 'react';
import { ActionCategory } from '../../../data/actions/action';
import { ActionAccordionItem } from './ActionAccordionItem';
import ActionPanelAccordionButton from './ActionPanelAccordionButton';
import { ActionPanelContext } from './actionPanelContext';

export interface ActionGroupAccordionItemProps {
  actionCategory: ActionCategory;
}

export default function ActionGroupAccordionItem({ actionCategory }: ActionGroupAccordionItemProps) {
  const { filledActionAnswers } = useContext(ActionPanelContext);
  const countOfFilledAnswers = Object.values(filledActionAnswers).filter((filledAction) =>
    actionCategory.actions.some((action) => action.id === filledAction?.actionId),
  ).length;

  return (
    <AccordionItem key={actionCategory.forSurvey} maxW="100%">
      <ActionPanelAccordionButton
        badge={countOfFilledAnswers > 0 ? <Tag colorScheme="primary">{countOfFilledAnswers}</Tag> : undefined}
        icon={<Icon as={actionCategory.icon} />}
        title={actionCategory.name}
      />
      <AccordionPanel pr="0">
        <Accordion allowToggle>
          {actionCategory.actions.map((action) => (
            <ActionAccordionItem key={action.id} action={action} />
          ))}
        </Accordion>
      </AccordionPanel>
    </AccordionItem>
  );
}
