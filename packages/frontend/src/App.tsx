import { ChakraProvider } from '@chakra-ui/react';
import { appTheme } from './theme';
import { Route, Switch } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import LandingPage from './pages/landing/LandingPage';

export default function App() {
  return (
    <ChakraProvider theme={appTheme}>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={LandingPage} />
        </Switch>
      </BrowserRouter>
    </ChakraProvider>
  );
}
