import { Flex, Box, Heading, HStack } from '@chakra-ui/react';
import { ReactNode } from 'react';

export interface DefaultPageLayoutProps {
  title: string;
  children?: ReactNode;
  actions?: ReactNode;
  leftArea?: ReactNode;
  rightArea?: ReactNode;
}

export default function DefaultPageLayout({ title, children, actions, leftArea, rightArea }: DefaultPageLayoutProps) {
  const mainContent = (
    <Flex grow={1} flexDir="column" h="100%" px="8">
      {(title || actions) && (
        <Flex justify="space-between" mb="8">
          <Box as="header">
            <Heading as="h1" isTruncated>
              {title}
            </Heading>
          </Box>
          <HStack spacing="4">{actions}</HStack>
        </Flex>
      )}
      <Box as="article">{children}</Box>
    </Flex>
  );

  return (
    <Flex h="100%" px="8" py="4">
      <Box as="aside" h="100%">
        {leftArea}
      </Box>
      {mainContent}
      <Box as="aside" h="100%">
        {rightArea}
      </Box>
    </Flex>
  );
}
