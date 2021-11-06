import { ChakraProvider } from '@chakra-ui/react';
import { appTheme } from './theme';
import { Route, Switch } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import Hello from './Hello';

export default function App() {
  return (
    <ChakraProvider theme={appTheme}>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Hello} />
        </Switch>
      </BrowserRouter>
    </ChakraProvider>
  );
}
