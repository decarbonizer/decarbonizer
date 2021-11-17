import { Box, Button, Icon } from '@chakra-ui/react';
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
        <Button
          variant="ghost"
          aria-label={name}
          leftIcon={<Icon as={icon} />}
          color={isSelected ? 'primary.600' : undefined}
          opacity={isSelected ? 1.0 : 0.6}
          _hover={{ opacity: 1.0, bg: 'gray.100' }}>
          {name}
        </Button>
      </Link>
    </Box>
  );
}
