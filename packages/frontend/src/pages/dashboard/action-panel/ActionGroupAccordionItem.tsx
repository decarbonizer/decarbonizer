import { Accordion, AccordionItem, AccordionPanel, Icon, Tag } from '@chakra-ui/react';
import { useContext } from 'react';
import { ActionCategory } from '../../../data/actions/action';
import { ActionAccordionItem } from './ActionAccordionItem';
import SidePanelAccordionButton from '../../../components/SidePanelAccordionButton';
import { DashboardContext } from '../dashboardContext';

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
  const { filledActionAnswers } = useContext(DashboardContext);
  const countOfFilledAnswers = Object.values(filledActionAnswers).filter((filledAction) =>
    actionCategory.actions.some((action) => action.id === filledAction?.actionId),
  ).length;

  return (
    <>
      <SidePanelAccordionButton
        px="2"
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
