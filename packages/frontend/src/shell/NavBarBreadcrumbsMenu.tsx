import { Icon, IconButton, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { ReactElement } from 'react';
import { RiSurveyLine, RiMoneyEuroCircleLine } from 'react-icons/ri';
import { IoIosArrowDown } from 'react-icons/io';
import { MdDashboard, MdPendingActions } from 'react-icons/md';
import { routes } from '../routes';
import { Link } from 'react-router-dom';

export interface PageNavigation {
  icon?: ReactElement;
  value: string;
  display: string;
}

export type PageDisplayTypes = 'Survey Overview' | 'New Action Plan' | 'Action Plan Overview' | 'Budget Management';

export interface NavBarBreadcrumbsMenuProps {
  currentPage: PageDisplayTypes;
  realEstateId: string;
}

export default function NavigationMenu({ currentPage, realEstateId }: NavBarBreadcrumbsMenuProps) {
  const pages: PageNavigation[] = [
    { value: routes.surveys({ realEstateId }), display: 'Survey Overview', icon: <Icon as={RiSurveyLine} /> },
    {
      value: routes.realEstateDashboard({ realEstateId }),
      display: 'New Action Plan',
      icon: <Icon as={MdDashboard} />,
    },
    {
      value: routes.actionPlans({ realEstateId }),
      display: 'Action Plan Overview',
      icon: <Icon as={MdPendingActions} />,
    },
    {
      value: routes.actionPlansBudgetOverview({ realEstateId }),
      display: 'Budget Management',
      icon: <Icon as={RiMoneyEuroCircleLine} />,
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
          <Link key={page.value} to={page.value}>
            <MenuItem value={page.value} icon={page.icon}>
              {page.display}
            </MenuItem>
          </Link>
        ))}
      </MenuList>
    </Menu>
  );
}
