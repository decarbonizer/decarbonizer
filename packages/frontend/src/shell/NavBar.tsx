import { Heading, HStack, Spacer } from '@chakra-ui/react';
import { AiOutlineHome } from 'react-icons/ai';
import { BsClipboardData } from 'react-icons/bs';
import { generatePath } from 'react-router';
import { routes } from '../constants';
import NavBarAccountItem from './NavBarAccountItem';
import NavBarLink, { NavBarLinkProps } from './NavBarLink';

const links: Array<NavBarLinkProps> = [
  {
    name: 'Dashboard',
    to: routes.home,
    icon: AiOutlineHome,
  },
  {
    name: 'Surveys',
    to: generatePath(routes.surveys),
    icon: BsClipboardData,
  },
];

export default function NavBar() {
  return (
    <HStack as="nav" px="8" py="4" spacing="4">
      <Heading as="h1" role="figure" fontSize="lg" color="primary.500" mr="8">
        Decarbonizer
      </Heading>
      {links.map((navBarLink) => (
        <NavBarLink key={navBarLink.to} {...navBarLink} />
      ))}
      <Spacer />
      <NavBarAccountItem />
    </HStack>
  );
}
