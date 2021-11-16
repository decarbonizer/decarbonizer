import { Switch, Route } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import { useAppSelector } from './store/store';
import LandingPage from './pages/landing/LandingPage';
import AppShell from './shell/AppShell';

export default function AppRoutes() {
  const isLoggedIn = useAppSelector((state) => !!state.auth.token);

  return (
    <BrowserRouter>
      <Switch>
        <Route render={() => (isLoggedIn ? <AppShell /> : <LandingPage />)} />
      </Switch>
    </BrowserRouter>
  );
}
