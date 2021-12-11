import { Heading, HStack, Spacer } from '@chakra-ui/react';
import NavBarAccountItem from './NavBarAccountItem';
import NavBarBreadcrumbs from './NavBarBreadcrumbs';

export default function NavBar() {
  return (
    <HStack as="nav" px="8" py="4" spacing="4">
      <Heading as="h1" role="figure" fontSize="lg" color="primary.500" mr="8">
        Decarbonizer
      </Heading>
      <NavBarBreadcrumbs />
      <Spacer />
      <NavBarAccountItem />
    </HStack>
  );
}
