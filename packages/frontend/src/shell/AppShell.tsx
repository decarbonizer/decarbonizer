import { Redirect, Route, Switch } from 'react-router';
import { routes } from '../constants';
import HomePage from '../pages/home/HomePage';
import SurveyPage from '../pages/survey/SurveyPage';
import NavBar from './NavBar';

export default function AppShell() {
  return (
    <>
      <NavBar />
      <Switch>
        <Route exact path={routes.home} component={HomePage} />
        <Route exact path={routes.survey} component={SurveyPage} />
        <Route render={() => <Redirect to={routes.home} />} />
      </Switch>
    </>
  );
}
