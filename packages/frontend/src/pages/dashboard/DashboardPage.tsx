import { Box, Button, Flex, Heading, Stack } from '@chakra-ui/react';
import { useParams } from 'react-router';
import { DashboardPageParams } from '../../routes';
import { useGetAllSurveyAnswersForRealEstateQuery } from '../../store/api';
import ActionPanel from '../../components/actions-menu/ActionPanel';

export default function DashboardPage() {
  const { realEstateId } = useParams<DashboardPageParams>();
  const { data, isLoading } = useGetAllSurveyAnswersForRealEstateQuery({ realEstateId: realEstateId });

  return (
    <Flex minH="100%">
      <Flex
        as="aside"
        direction="column"
        justify="flex-start"
        align="center"
        pos="sticky"
        minW="350"
        maxW="350"
        paddingTop="8"
        paddingBottom="8"
        bg="gray.50"
        border="1px"
        borderColor="gray.200"
        shadow="xl"
        zIndex="100">
        <Heading as="h3" color="darkgreen" pb={10}>
          Decarbonizer
        </Heading>
        <ActionPanel surveyAnswers={data} />
        <Box w="100%" pt="14" align="right" pr="5">
          <Button colorScheme="primary"> Save Actions</Button>
        </Box>
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
