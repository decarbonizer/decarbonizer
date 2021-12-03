import { AccordionButton, AccordionIcon, HStack, Spacer, Text } from '@chakra-ui/react';
import { ReactNode } from 'react';

export interface ActionPanelAccordionButtonProps {
  icon?: ReactNode;
  title: string;
  badge?: ReactNode;
  buttons?: ReactNode;
}

export default function ActionPanelAccordionButton({ icon, title, badge, buttons }: ActionPanelAccordionButtonProps) {
  return (
    <AccordionButton>
      <HStack w="100%">
        {badge}
        {icon}
        <Text>{title}</Text>
        <Spacer />
        {buttons}
        <AccordionIcon />
      </HStack>
    </AccordionButton>
  );
}
