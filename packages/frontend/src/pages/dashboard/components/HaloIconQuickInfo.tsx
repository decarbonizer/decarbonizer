import { BoxProps, HStack, Text } from '@chakra-ui/react';
import { ReactNode } from 'react';

export interface IconQuickInfoProps extends BoxProps {
  icon?: ReactNode;
}

/**
 * Renders a (halo) icon with a text quick info right next to it.
 * Used to quickly display key information in the dashboard.
 */
export default function IconQuickInfo({ icon, children, ...rest }: IconQuickInfoProps) {
  return (
    <HStack spacing="4" {...rest}>
      {icon}
      <Text fontSize="4xl" fontWeight="bold" isTruncated>
        {children}
      </Text>
    </HStack>
  );
}
