import { Heading, HStack } from '@chakra-ui/react';
import { AiOutlineHome } from 'react-icons/ai';
import { BsClipboardData } from 'react-icons/bs';
import { routes } from '../constants';
import NavBarLink, { NavBarLinkProps } from './NavBarLink';

const links: Array<NavBarLinkProps> = [
  {
    name: 'Dashboard',
    to: routes.home,
    icon: AiOutlineHome,
  },
  {
    name: 'Surveys',
    to: routes.survey,
    icon: BsClipboardData,
  },
];

export default function NavBar() {
  return (
    <HStack as="nav" p="4" spacing="8">
      <Heading as="h1" role="figure" fontSize="lg" color="primary.500" mr="8">
        Decarbonizer
      </Heading>
      {links.map((navBarLink) => (
        <NavBarLink key={navBarLink.to} {...navBarLink} />
      ))}
    </HStack>
  );
}
