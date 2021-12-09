import { Box, Grid, Heading } from '@chakra-ui/react';
import { ReactNode } from 'react';
import Card, { CardProps } from '../../../components/Card';

export interface DashboardCardProps extends CardProps {
  header?: ReactNode;
}

export default function DashboardCard({ header, children, ...rest }: DashboardCardProps) {
  return (
    <Card p="6" {...rest}>
      <Grid templateRows="auto, 1fr" templateColumns="1fr, auto" gap="4" h="100%">
        <Heading as="h3" size="sm" color="gray.600" isTruncated gridRow={1}>
          {header}
        </Heading>
        <Box gridRow={2} gridColumnSpan={2}>
          {children}
        </Box>
      </Grid>
    </Card>
  );
}
