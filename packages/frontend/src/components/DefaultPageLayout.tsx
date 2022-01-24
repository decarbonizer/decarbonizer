import { Flex, Box, Heading, HStack, FlexProps } from '@chakra-ui/react';
import { ReactNode } from 'react';

export interface DefaultPageLayoutProps {
  title?: string;
  children?: ReactNode;
  actions?: ReactNode;
  leftArea?: ReactNode;
  rightArea?: ReactNode;
  contentProps?: FlexProps;
}

export default function DefaultPageLayout({
  title,
  children,
  actions,
  leftArea,
  rightArea,
  contentProps,
}: DefaultPageLayoutProps) {
  const mainContent = (
    <Flex grow={1} flexDir="column" px="8" {...contentProps}>
      {(title || actions) && (
        <Flex justify="space-between" mb="8">
          <Box as="header">
            {title && (
              <Heading as="h1" isTruncated>
                {title}
              </Heading>
            )}
          </Box>
          <HStack spacing="4">{actions}</HStack>
        </Flex>
      )}
      <Box as="article" flexGrow={1}>
        {children}
      </Box>
    </Flex>
  );

  return (
    <Flex as="article" grow={1} h="100%">
      {leftArea && <Box as="aside">{leftArea}</Box>}
      {mainContent}
      {rightArea && <Box as="aside">{rightArea}</Box>}
    </Flex>
  );
}
