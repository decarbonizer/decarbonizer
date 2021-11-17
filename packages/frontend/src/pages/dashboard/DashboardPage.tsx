import { Box, Flex, Heading, Stack } from '@chakra-ui/react';
import ActionsMenuComponent from '../../components/actions-menu/ActionsMenuComponent';

export default function DashboardPage() {
  return (
    <Flex minH="100%">
      <Flex
        as="aside"
        direction="column"
        justify="flex-start"
        align="center"
        pos="sticky"
        minW="250"
        paddingTop="8"
        paddingBottom="8"
        bg="gray.50"
        border="1px"
        borderColor="gray.200"
        shadow="xl"
        zIndex="100">
        <Heading as="h3" color="darkgreen">
          Decarbonizer
        </Heading>
        <Heading as="h5" size="md" paddingTop="4">
          Take actions
        </Heading>
        <ActionsMenuComponent />
      </Flex>
      <Box w="100%" grow={1}>
        <Stack align="center">
          <Heading as="h1">Dashboard</Heading>
          <Heading as="h2" size="lg">
            Dashboard title
          </Heading>
        </Stack>
      </Box>
    </Flex>
  );
}
