import { Flex } from '@chakra-ui/react';
import { Redirect, Route, Switch } from 'react-router';
import { routes } from '../routes';
import DashboardPage from '../pages/dashboard/DashboardPage';
import HomePage from '../pages/home/HomePage';
import SurveyOverviewPage from '../pages/survey/SurveyOverviewPage';
import ActionPlanOverviewPage from '../pages/plan/ActionPlanOverviewPage';
import NavBar from './NavBar';
import ActionPlanFileExportPage from '../pages/plan/ActionPlanFileExportPage';

export default function AppShell() {
  return (
    <Flex minH="100%" flexDir="column">
      <NavBar />
      <Flex flexGrow="1" flexDir="column">
        <Switch>
          <Route exact path={routes.home()} component={HomePage} />
          <Route exact path={routes.surveys.route} component={SurveyOverviewPage} />
          <Route exact path={routes.realEstateDashboard.route} component={DashboardPage} />
          <Route exact path={routes.actionPlans.route} component={ActionPlanOverviewPage} />
          <Route exact path={routes.actionPlanFileExport.route} component={ActionPlanFileExportPage} />
          <Route render={() => <Redirect to={routes.home.route} />} />
        </Switch>
      </Flex>
    </Flex>
  );
}
