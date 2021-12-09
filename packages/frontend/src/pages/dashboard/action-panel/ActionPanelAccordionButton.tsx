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
    <AccordionButton px="2">
      <HStack w="100%">
        <AccordionIcon />
        {badge}
        {icon}
        <Text fontWeight="semibold">{title}</Text>
        <Spacer />
        {buttons}
      </HStack>
    </AccordionButton>
  );
}
