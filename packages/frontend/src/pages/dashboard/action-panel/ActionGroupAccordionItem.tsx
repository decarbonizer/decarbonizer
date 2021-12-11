import { Accordion, AccordionItem, AccordionPanel, Tag, Icon } from '@chakra-ui/react';
import { useContext, useEffect } from 'react';
import { ActionCategory } from '../../../data/actions/action';
import { ActionAccordionItem } from './ActionAccordionItem';
import ActionPanelAccordionButton from './ActionPanelAccordionButton';
import { ActionPanelContext } from './actionPanelContext';

export interface ActionGroupAccordionItemProps {
  actionCategory: ActionCategory;
}

export default function ActionGroupAccordionItem({ actionCategory }: ActionGroupAccordionItemProps) {
  return (
    <AccordionItem maxW="100%" borderWidth="0 !important">
      {({ isExpanded }) => <ActionGroupAccordionContent isExpanded={isExpanded} actionCategory={actionCategory} />}
    </AccordionItem>
  );
}

interface ActionGroupAccordionContentProps {
  isExpanded: boolean;
  actionCategory: ActionCategory;
}

function ActionGroupAccordionContent({ isExpanded, actionCategory }: ActionGroupAccordionContentProps) {
  const { filledActionAnswers, setSelectedActionCategory } = useContext(ActionPanelContext);
  const countOfFilledAnswers = Object.values(filledActionAnswers).filter((filledAction) =>
    actionCategory.actions.some((action) => action.id === filledAction?.actionId),
  ).length;

  useEffect(() => {
    if (isExpanded) {
      setSelectedActionCategory(actionCategory);
    } else {
      setSelectedActionCategory(undefined);
    }
  }, [actionCategory, isExpanded, setSelectedActionCategory]);

  return (
    <>
      <ActionPanelAccordionButton
        badge={countOfFilledAnswers > 0 ? <Tag colorScheme="primary">{countOfFilledAnswers}</Tag> : undefined}
        icon={<Icon as={actionCategory.icon} />}
        title={actionCategory.name}
      />
      <AccordionPanel pr="0">
        <Accordion pl="4" allowToggle>
          {actionCategory.actions.map((action) => (
            <ActionAccordionItem key={action.id} action={action} />
          ))}
        </Accordion>
      </AccordionPanel>
    </>
  );
}
