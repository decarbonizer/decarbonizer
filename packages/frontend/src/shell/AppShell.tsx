import { Box } from '@chakra-ui/react';
import { Redirect, Route, Switch } from 'react-router';
import { routes } from '../constants';
import DashboardPage from '../pages/dashboard/DashboardPage';
import HomePage from '../pages/home/HomePage';
import SurveyOverviewPage from '../pages/survey/SurveyOverviewPage';
import NavBar from './NavBar';

export default function AppShell() {
  return (
    <Box minH="100%">
      <NavBar />
      <Switch>
        <Route exact path={routes.home()} component={HomePage} />
        <Route exact path={routes.surveys.route} component={SurveyOverviewPage} />
        <Route exact path={routes.realEstateDashboard.route} component={DashboardPage} />
        <Route render={() => <Redirect to={routes.home.route} />} />
      </Switch>
    </Box>
  );
}
