import { Box, BoxProps, ComponentSingleStyleConfig, useStyleConfig, ThemingProps } from '@chakra-ui/react';
import { ReactNode } from 'react';

export interface CardProps extends BoxProps, ThemingProps<'Card'> {
  children?: ReactNode;
  isStatic?: boolean;
}

export const CardTheme: ComponentSingleStyleConfig = {
  baseStyle: {
    border: '1px',
    bg: 'white',
    borderColor: 'gray.100',
    transition: 'all 250ms',
  },
  sizes: {
    md: {
      shadow: 'lg',
      rounded: 'md',
      _hover: {
        shadow: 'xl',
        transform: 'translateY(-0.25rem)',
      },
    },
    lg: {
      rounded: 'xl',
      shadow: '2xl',
      _hover: {
        shadow: '4xl',
        transform: 'translateY(-0.25rem)',
      },
    },
  },
  defaultProps: {
    size: 'md',
  },
};

export default function Card({ children, isStatic, ...rest }: CardProps) {
  const styles = useStyleConfig('Card', rest);

  return (
    <Box __css={styles} {...(isStatic ? { _hover: {} } : {})} {...rest}>
      {children}
    </Box>
  );
}
