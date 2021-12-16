import { Icon, IconButton, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { ReactElement } from 'react';
import { RiSurveyLine } from 'react-icons/ri';
import { IoIosArrowDown } from 'react-icons/io';
import { MdDashboard, MdPendingActions } from 'react-icons/md';
import { useHistory } from 'react-router';
import { routes } from '../routes';

export interface PageNavigation {
  icon?: ReactElement;
  value: string;
  display: string;
}

export type PageDisplayTypes = 'Survey Overview' | 'Dashboard' | 'Action Plan Overview';

export interface NavigationMenuProps {
  currentPage: PageDisplayTypes;
  realEstateId: string;
}

export default function NavigationMenu({ currentPage, realEstateId }: NavigationMenuProps) {
  const history = useHistory();
  const pages: PageNavigation[] = [
    { value: routes.surveys({ realEstateId }), display: 'Survey Overview', icon: <Icon as={RiSurveyLine} /> },
    { value: routes.realEstateDashboard({ realEstateId }), display: 'Dashboard', icon: <Icon as={MdDashboard} /> },
    {
      value: routes.actionPlans({ realEstateId }),
      display: 'Action Plan Overview',
      icon: <Icon as={MdPendingActions} />,
    },
  ];
  const filteredPages = pages.filter((page) => page.display !== currentPage);

  return (
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label="Options"
        icon={<IoIosArrowDown />}
        fontSize="15"
        variant="ghost"
        size="xs"
        pl="-10"
      />
      <MenuList>
        {filteredPages.map((page) => (
          <MenuItem key={page.value} value={page.value} icon={page.icon} onClick={() => history.push(page.value)}>
            {page.display}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
}
