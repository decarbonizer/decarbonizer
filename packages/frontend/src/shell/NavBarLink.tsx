import { Box, HStack, Icon, Text } from '@chakra-ui/react';
import { ComponentType } from 'react';
import { useRouteMatch } from 'react-router';
import { Link } from 'react-router-dom';

export interface NavBarLinkProps {
  name: string;
  to: string;
  icon?: ComponentType;
}

export default function NavBarLink({ name, to, icon }: NavBarLinkProps) {
  const isSelected = !!useRouteMatch(to);

  return (
    <Box>
      <Link to={to}>
        <HStack
          color={isSelected ? 'primary.600' : undefined}
          opacity={isSelected ? 1.0 : 0.6}
          fontWeight="semibold"
          transition="all 250ms"
          _hover={{ opacity: 1.0 }}>
          <Icon as={icon} />
          <Text>{name}</Text>
        </HStack>
      </Link>
    </Box>
  );
}
