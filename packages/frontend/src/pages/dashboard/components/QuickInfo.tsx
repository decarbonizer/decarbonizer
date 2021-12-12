import { StackProps, Stack } from '@chakra-ui/react';
import { ReactNode } from 'react';

export interface QuickInfoProps extends StackProps {
  icon?: ReactNode;
}

/**
 * Renders a quick info, typically with an icon and a text right next to it.
 * Used to quickly display key information in the dashboard.
 */
export default function QuickInfo({ icon, children, ...rest }: QuickInfoProps) {
  return (
    <Stack spacing="4" direction="row" alignItems="center" {...rest}>
      {icon}
      {children}
    </Stack>
  );
}
