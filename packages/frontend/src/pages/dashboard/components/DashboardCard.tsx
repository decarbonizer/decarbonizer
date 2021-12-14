import { Box, HStack, Tooltip, VStack, Heading, Spacer, IconButton, Icon, useBoolean } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { BiExpandAlt, BiCollapse } from 'react-icons/bi';
import Card, { CardProps } from '../../../components/Card';

export interface DashboardCardProps extends CardProps {
  header?: ReactNode;
  headerControls?: ReactNode;
  isExpandable?: boolean;
}

export default function DashboardCard({ header, children, headerControls, isExpandable, ...rest }: DashboardCardProps) {
  const [isExpanded, setIsExpanded] = useBoolean();

  return (
    <Card
      p="6"
      {...rest}
      zIndex={isExpanded ? 100 : rest.zIndex}
      gridRow={isExpanded ? '1 / -1' : rest.gridRow}
      gridColumn={isExpanded ? '1 / -1' : rest.gridColumn}
      mb={isExpanded ? '-4' : rest.mb}>
      <VStack alignItems="stretch" spacing="4" h="100%">
        <HStack align="flex-start">
          <Heading as="h3" size="sm" color="gray.600" isTruncated>
            {header}
          </Heading>
          <Spacer />
          {headerControls}
          {isExpandable && (
            <Tooltip label={isExpanded ? 'Collapse' : 'Expand'}>
              <IconButton
                aria-label="Expand card"
                variant="ghost"
                size="sm"
                icon={<Icon as={isExpanded ? BiCollapse : BiExpandAlt} />}
                onClick={setIsExpanded.toggle}
              />
            </Tooltip>
          )}
        </HStack>
        <Box flexGrow={1}>{children}</Box>
      </VStack>
    </Card>
  );
}
