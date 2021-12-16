import { Heading, HStack, Spacer } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import NavBarAccountItem from './NavBarAccountItem';
import NavBarBreadcrumbs from './NavBarBreadcrumbs';

export default function NavBar() {
  const [isScrolled, setIsScrolled] = useState(!!window.scrollY);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(!!window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <HStack
      as="nav"
      h="4.5rem"
      mb="0.5rem"
      px="8"
      spacing="4"
      pos="sticky"
      top="0"
      zIndex={100}
      bg={isScrolled ? 'white' : undefined}
      shadow={isScrolled ? 'sm' : undefined}
      transition="all 250ms">
      <Heading as="h1" role="figure" fontSize="lg" color="primary.500" mr="8">
        Decarbonizer
      </Heading>
      <NavBarBreadcrumbs />
      <Spacer />
      <NavBarAccountItem />
    </HStack>
  );
}
