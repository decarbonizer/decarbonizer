import { ColorModeScript } from '@chakra-ui/react';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { appTheme } from './theme';

ReactDOM.render(
  <StrictMode>
    <ColorModeScript initialColorMode={appTheme.config.initialColorMode} />
    <App />
  </StrictMode>,
  document.getElementById('root'),
);
