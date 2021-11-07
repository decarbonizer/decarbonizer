import { ChakraProvider } from '@chakra-ui/react';
import { appTheme } from './theme';
import { Route, Switch } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import LandingPage from './pages/landing/LandingPage';
import SurveyPage from './pages/survey/SurveyPage';

export default function App() {
  return (
    <ChakraProvider theme={appTheme}>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={LandingPage} />
          <Route exact path="/survey" component={SurveyPage} />
        </Switch>
      </BrowserRouter>
    </ChakraProvider>
  );
}
