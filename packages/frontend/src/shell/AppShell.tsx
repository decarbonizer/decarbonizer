import { Flex } from '@chakra-ui/react';
import { Redirect, Route, Switch } from 'react-router';
import { routes } from '../routes';
import DashboardPage from '../pages/dashboard/DashboardPage';
import HomePage from '../pages/home/HomePage';
import SurveyOverviewPage from '../pages/survey/SurveyOverviewPage';
import NavBar from './NavBar';

export default function AppShell() {
  return (
    <Flex minH="100%" flexDir="column">
      <NavBar />
      <Flex flexGrow="1" flexDir="column">
        <Switch>
          <Route exact path={routes.home()} component={HomePage} />
          <Route exact path={routes.surveys.route} component={SurveyOverviewPage} />
          <Route exact path={routes.realEstateDashboard.route} component={DashboardPage} />
          <Route render={() => <Redirect to={routes.home.route} />} />
        </Switch>
      </Flex>
    </Flex>
  );
}
