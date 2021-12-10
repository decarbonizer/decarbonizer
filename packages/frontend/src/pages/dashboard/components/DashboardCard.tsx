import { Box, VStack, Heading } from '@chakra-ui/react';
import { ReactNode } from 'react';
import Card, { CardProps } from '../../../components/Card';

export interface DashboardCardProps extends CardProps {
  header?: ReactNode;
}

export default function DashboardCard({ header, children, ...rest }: DashboardCardProps) {
  return (
    <Card p="6" {...rest}>
      <VStack alignItems="stretch" spacing="4" h="100%">
        <Heading as="h3" size="sm" color="gray.600" isTruncated>
          {header}
        </Heading>
        <Box flexGrow={1}>{children}</Box>
      </VStack>
    </Card>
  );
}
