import { Box, Flex, Heading, Stack } from '@chakra-ui/react';
import CityBoxComponent from '../../components/CityBoxComponent';

export default function SurveyPage() {
  const cities = [
    {
      name: 'Munich',
      capacity: 545,
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      size: 6000,
    },
    { name: 'Ratingen', capacity: 322, description: 'Description 2', size: 5300 },
    { name: 'Stuttgart', capacity: 231, description: 'Description 3', size: 8000 },
    { name: 'Berlin', capacity: 586, size: 1000, description: 'Description 4' },
  ];

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
          <Heading as="h2" size="lg" color="gray.600">
            Topic-Placeholder
          </Heading>
          <CityBoxComponent cities={cities} />
        </Stack>
      </Box>
    </Flex>
  );
}
