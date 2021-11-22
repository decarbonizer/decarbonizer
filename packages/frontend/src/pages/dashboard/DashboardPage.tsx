import { Box, Flex, Grid, GridItem, Heading, Stack } from '@chakra-ui/react';
import { useParams } from 'react-router';
import ActionsMenuComponent from '../../components/actions-menu/ActionsMenuComponent';
import { DashboardParams } from '../../routes';
import {
  useGetAllSurveyAnswersForRealEstateQuery,
  useGetAllBulbsQuery,
  useGetAllRealEstatesQuery,
  useGetAllSurveyAnswersQuery,
} from '../../store/api';
import CarbonFootprintComponent from './CarbonFootpintComponent';
import ComparisonComponent from './ComparisonComponent';
import { NetZeroComponent } from './NetZeroComponent';

export default function DashboardPage() {
  const { realEstateId } = useParams<DashboardParams>();

  const { isLoading: isLoadingSurveyAnswers, data: surveyAnswers } = useGetAllSurveyAnswersForRealEstateQuery({
    realEstateId: realEstateId,
  });
  const { isLoading: isLoadingBulbs, data: bulbs } = useGetAllBulbsQuery();
  const { isLoading: isLoadingRealEstates, data: realEstates } = useGetAllRealEstatesQuery();
  const { isLoading: isLoadingAllSurveyAnswers, data: allSurveyAnswers } = useGetAllSurveyAnswersQuery();

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
          <Heading as="h2" size="lg" color="green">
            Calculating your footprint...
          </Heading>
          <Grid templateColumns="repeat(2, 2fr)" templateRows="repeat(2, 2fr)" gap={6} p="4">
            <GridItem rowSpan={2} colSpan={1}>
              <ComparisonComponent
                isLoadingAllSurveyAnswers={isLoadingAllSurveyAnswers}
                allSurveyAnswers={allSurveyAnswers}
                isLoadingBulbs={isLoadingBulbs}
                bulbs={bulbs}
                isLoadingRealEstates={isLoadingRealEstates}
                realEstates={realEstates}
              />
            </GridItem>
            <GridItem rowSpan={1} w="80">
              <CarbonFootprintComponent
                isLoadingSurveyAnswers={isLoadingSurveyAnswers}
                surveyAnswers={surveyAnswers}
                isLoadingBulbs={isLoadingBulbs}
                bulbs={bulbs}
              />
            </GridItem>
            <GridItem rowSpan={1} w="80">
              <NetZeroComponent />
            </GridItem>
          </Grid>
        </Stack>
      </Box>
    </Flex>
  );
}
