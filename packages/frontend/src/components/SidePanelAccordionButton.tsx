import { AccordionButton, AccordionButtonProps, AccordionIcon, HStack, Spacer, Text } from '@chakra-ui/react';
import { ReactNode } from 'react';

export interface ActionPanelAccordionButtonProps extends AccordionButtonProps {
  icon?: ReactNode;
  title: string;
  badge?: ReactNode;
  buttons?: ReactNode;
}

export default function SidePanelAccordionButton({
  icon,
  title,
  badge,
  buttons,
  ...rest
}: ActionPanelAccordionButtonProps) {
  return (
    <AccordionButton {...rest}>
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
