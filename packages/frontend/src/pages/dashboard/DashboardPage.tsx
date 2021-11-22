import { Box, Button, Flex, Grid, GridItem, Heading, Stack } from '@chakra-ui/react';
import { useParams } from 'react-router';
import {
  useGetAllSurveyAnswersForRealEstateQuery,
  useGetAllBulbsQuery,
  useGetAllRealEstatesQuery,
  useGetAllSurveyAnswersQuery,
} from '../../store/api';
import CarbonFootprintComponent from './CarbonFootpintComponent';
import ComparisonComponent from './ComparisonComponent';
import { NetZeroComponent } from './NetZeroComponent';
import { DashboardPageParams } from '../../routes';
import ActionPanel from '../../components/actions-menu/ActionPanel';
import { useEffect } from 'react';
import React from 'react';
import IlluminationOverviewComponent from './illumination/illuminationOverviewComponent';

export default function DashboardPage() {
  const { realEstateId } = useParams<DashboardPageParams>();

  const { isLoading: isLoadingSurveyAnswers, data: surveyAnswers } = useGetAllSurveyAnswersForRealEstateQuery({
    realEstateId: realEstateId,
  });
  const { isLoading: isLoadingBulbs, data: bulbs } = useGetAllBulbsQuery();
  const { isLoading: isLoadingRealEstates, data: realEstates } = useGetAllRealEstatesQuery();
  const { isLoading: isLoadingAllSurveyAnswers, data: allSurveyAnswers } = useGetAllSurveyAnswersQuery();

  const [cityName, setCityName] = React.useState('');
  const [openedActionsCategory, setOpenedActionsCategory] = React.useState('illumination');

  useEffect(() => {
    if (realEstates) {
      const currentRealEstate = realEstates.find((realEstate) => realEstate._id == realEstateId);
      if (currentRealEstate) setCityName(currentRealEstate?.cityName);
    }
  }, []);

  const onChangeActionsCategory = (value: string) => {
    //TODO display illumination data only when illumination is chosen
    setOpenedActionsCategory(value);
  };

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
        <ActionPanel surveyAnswers={surveyAnswers} />
        <Box w="100%" pt="14" align="right" pr="5">
          <Button colorScheme="primary"> Save Actions</Button>
        </Box>
      </Flex>
      <Box w="100%" grow={1}>
        <Stack align="center">
          <Heading as="h1">Dashboard</Heading>
          <Heading as="h2" size="lg">
            {cityName}
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
          {openedActionsCategory === 'illumination' && (
            <Grid>
              <IlluminationOverviewComponent
                isLoadingSurveyAnswers={isLoadingSurveyAnswers}
                surveyAnswers={surveyAnswers}
                isLoadingBulbs={isLoadingBulbs}
                bulbs={bulbs}
              />
            </Grid>
          )}
        </Stack>
      </Box>
    </Flex>
  );
}
