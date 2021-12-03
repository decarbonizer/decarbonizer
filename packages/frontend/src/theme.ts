import { theme, extendTheme, ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

export const appTheme = extendTheme({
  config,
  colors: {
    primary: theme.colors.green,
  },
  layerStyles: {
    hint: {
      color: 'gray.500',
      fontSize: 'sm',
    },
  },
  styles: {
    global: {
      'html, body, #root': {
        height: '100vh',
        backgroundColor: '#fcfcfc',
      },
    },
  },
});
