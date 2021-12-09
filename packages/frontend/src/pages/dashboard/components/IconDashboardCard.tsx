import { Box, Center, HStack, Icon, Text } from '@chakra-ui/react';
import { ComponentType } from 'react';
import DashboardCard, { DashboardCardProps } from './DashboardCard';

export interface IconDashboardCardProps extends DashboardCardProps {
  icon: ComponentType;
}

export default function IconDashboardCard({ icon, children, ...rest }: IconDashboardCardProps) {
  return (
    <DashboardCard {...rest}>
      <HStack>
        <Box rounded="full" bg="primary.100" p="5%" opacity={0.8} w="16" h="16" mr="4">
          <Center>
            <Icon as={icon} w="100%" h="100%" color="primary.900" />
          </Center>
        </Box>
        <Text fontSize="4xl" fontWeight="bold" isTruncated>
          {children}
        </Text>
      </HStack>
    </DashboardCard>
  );
}
