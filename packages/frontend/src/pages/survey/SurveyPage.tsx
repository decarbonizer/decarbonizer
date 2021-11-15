import { Box, Flex, Heading, Stack } from '@chakra-ui/react';
import SurveyContainer from './SurveyContainer';

export default function SurveyPage() {
  return (
    <Flex minH="100%">
      <Flex
        as="aside"
        direction="column"
        justify="flex-start"
        align="center"
        pos="sticky"
        minW="200"
        p="8"
        bg="gray.50"
        border="1px"
        borderColor="gray.200"
        shadow="xl"
        zIndex="100">
        <Heading as="h3" color="darkgreen">
          Decarbonizer
        </Heading>
      </Flex>
      <Box w="100%" grow={1}>
        <Stack align="center">
          <Heading as="h1">Survey</Heading>
          <SurveyContainer />
        </Stack>
      </Box>
    </Flex>
  );
}
