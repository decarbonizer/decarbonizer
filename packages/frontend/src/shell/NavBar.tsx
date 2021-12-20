import { Heading, HStack, Spacer, Image } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import NavBarAccountItem from './NavBarAccountItem';
import NavBarBreadcrumbs from './NavBarBreadcrumbs';
import logo from '../img/decarbonizer.svg';
import { Link } from 'react-router-dom';
import { routes } from '../routes';

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
      <Link to={routes.home()}>
        <HStack>
          <Image boxSize="8" src={logo} alt="Decarbonizer Logo" />
          <Heading as="h1" role="figure" fontSize="lg" color="primary.500" mr="8">
            Decarbonizer
          </Heading>
        </HStack>
      </Link>
      <NavBarBreadcrumbs />
      <Spacer />
      <NavBarAccountItem />
    </HStack>
  );
}
