import { ChakraProvider } from '@chakra-ui/react';
import { appTheme } from './theme';
import Hello from './Hello';

export default function App() {
  return (
    <ChakraProvider theme={appTheme}>
      <Hello />
    </ChakraProvider>
  );
}
