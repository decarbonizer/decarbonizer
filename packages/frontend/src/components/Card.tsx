import { Box, BoxProps } from '@chakra-ui/react';
import { ReactNode } from 'react';

export interface CardProps extends BoxProps {
  children?: ReactNode;
  border?: string;
  borderColor?: string;
}

export default function Card({ children, ...rest }: CardProps) {
  return (
    <Box
      border="1px"
      bg="white"
      borderColor="gray.100"
      rounded="md"
      shadow="lg"
      transition="all 250ms"
      _hover={{
        shadow: '2xl',
        transform: 'translateY(-0.25rem)',
      }}
      {...rest}>
      {children}
    </Box>
  );
}
