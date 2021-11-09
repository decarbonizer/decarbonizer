import { ChakraProvider } from '@chakra-ui/react';
import { appTheme } from './theme';
import { Provider } from 'react-redux';
import AppRoutes from './AppRoutes';
import { store } from './store/store';

export default function App() {
  return (
    <ChakraProvider theme={appTheme}>
      <Provider store={store}>
        <AppRoutes />
      </Provider>
    </ChakraProvider>
  );
}
