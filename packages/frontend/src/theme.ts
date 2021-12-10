import { theme, extendTheme, ThemeConfig } from '@chakra-ui/react';
import { CardTheme } from './components/Card';
import { HaloIconTheme } from './components/HaloIcon';

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

export const appTheme = extendTheme({
  config,
  colors: {
    primary: theme.colors.green,
  },
  fonts: {
    heading: 'Open Sans',
    body: 'Open Sans',
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
        backgroundColor: '#f7f8fa',
        color: '#2a3256',
      },
      '.recharts-wrapper': {
        // Hack to make charts resize correctly. See https://stackoverflow.com/a/69200646
        position: 'absolute !important',
      },
    },
  },
  components: {
    Card: CardTheme,
    HaloIcon: HaloIconTheme,
  },
});
