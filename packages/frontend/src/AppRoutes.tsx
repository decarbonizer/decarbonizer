import { Switch, Route } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import HomePage from './pages/home/HomePage';
import LandingPage from './pages/landing/LandingPage';
import SurveyContainer from './pages/survey/SurveyContainer';
import SurveyPage from './pages/survey/SurveyPage';
import { useAppSelector } from './store/store';

export default function AppRoutes() {
  const isLoggedIn = useAppSelector((state) => !!state.auth.token);

  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" render={() => (isLoggedIn ? <HomePage /> : <LandingPage />)} />
        <Route exact path="/survey" component={SurveyPage} />
        <Route exact path="/survey-dev" component={SurveyContainer} />
      </Switch>
    </BrowserRouter>
  );
}
