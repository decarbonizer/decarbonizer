import { Image, Heading, Flex, Center, Box, Text, HTMLChakraProps, useBreakpointValue } from '@chakra-ui/react';
import { ReactNode } from 'react';

const sizeVariants = {
  md: {
    containerProps: {
      p: ['1', '2', '3', '4'],
      maxW: ['2xs', 'xs', 'sm', 'md'],
    },
    imageProps: {
      maxW: ['2xs', 'xs'],
      maxH: ['2xs', 'xs'],
    },
    titleProps: {
      fontSize: ['md', 'lg', 'xl', '2xl'],
    },
    descriptionProps: {
      fontSize: ['sm', 'md'],
    },
    actionsProps: {
      mt: ['1', '2', '3', '4'],
    },
  },
  xs: {
    containerProps: {
      p: ['1', '2'],
      maxW: ['2xs', 'xs'],
    },
    imageProps: {
      maxW: ['2xs'],
      maxH: ['2xs'],
      mb: ['1', '2'],
    },
    titleProps: {
      fontSize: ['md', 'lg'],
    },
    descriptionProps: {
      fontSize: ['sm', 'md'],
    },
    actionsProps: {
      mt: ['1', '2'],
    },
  },
};

export type EmptyStateSizeVariant = keyof typeof sizeVariants;

export interface EmptyStateProps extends HTMLChakraProps<'div'> {
  size?: EmptyStateSizeVariant | Array<EmptyStateSizeVariant>;
  imgSrc?: string;
  title?: string;
  description?: string;
  actions?: ReactNode;
}

/**
 * The component used accross the app to represent empty state.
 * Typically consists of a title and an image to fill up the empty space.
 * Optionally contains additional members such as action buttons.
 */
export default function EmptyState({ size = [], imgSrc, title, description, actions, ...rest }: EmptyStateProps) {
  const sizeBreakpoints = typeof size === 'string' ? [size] : size;
  const finalSize = useBreakpointValue(sizeBreakpoints) ?? 'md';
  const { containerProps, imageProps, titleProps, descriptionProps, actionsProps } = sizeVariants[finalSize];

  return (
    <Center w="100%" h="100%" {...rest}>
      <Flex direction="column" justify="center" align="center" {...containerProps}>
        {imgSrc && <Image src={imgSrc} boxSize="300px" alt="No Content" {...imageProps} />}
        {title && (
          <Heading as="h2" {...titleProps}>
            {title}
          </Heading>
        )}
        {description && (
          <Text textAlign="center" {...descriptionProps}>
            {description}
          </Text>
        )}
        {actions && <Box {...actionsProps}>{actions}</Box>}
      </Flex>
    </Center>
  );
}
