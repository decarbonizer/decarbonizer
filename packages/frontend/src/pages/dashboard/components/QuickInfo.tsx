import { BoxProps, Stack } from '@chakra-ui/react';
import { ReactNode } from 'react';

export interface QuickInfoProps extends BoxProps {
  icon?: ReactNode;
  childrenAlignment?: 'right' | 'bottom';
}

/**
 * Renders a quick info, typically with an icon and a text right next to it.
 * Used to quickly display key information in the dashboard.
 */
export default function QuickInfo({ icon, childrenAlignment = 'right', children, ...rest }: QuickInfoProps) {
  return (
    <Stack spacing="4" direction={childrenAlignment === 'right' ? 'row' : 'column'} alignItems="center" {...rest}>
      {icon}
      {children}
    </Stack>
  );
}
