import { Box, Button, Flex, Grid, GridItem, Heading, Stack } from '@chakra-ui/react';
import { useParams } from 'react-router';
import { useGetAllSurveyAnswersForRealEstateQuery, useGetAllRealEstatesQuery } from '../../store/api';
import CarbonFootprintComponent from './CarbonFootprint';
import ComparisonComponent from './Comparison';
import { NetZeroComponent } from './NetZero';
import { DashboardPageParams } from '../../routes';
import ActionPanel from '../../components/actions-menu/ActionPanel';
import React from 'react';
import IlluminationOverviewComponent from './illumination/IlluminationOverview';

export default function DashboardPage() {
  const { realEstateId } = useParams<DashboardPageParams>();
  const { isLoading: isLoadingSurveyAnswers, data: surveyAnswers } = useGetAllSurveyAnswersForRealEstateQuery({
    realEstateId: realEstateId,
  });

  const { isLoading: isLoadingRealEstates, data: realEstates } = useGetAllRealEstatesQuery();

  const cityName = realEstates?.find((realEstate) => realEstate._id === realEstateId)?.cityName ?? '';
  const [openedActionsCategory, setOpenedActionsCategory] = React.useState('illumination');

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
              <ComparisonComponent />
            </GridItem>
            <GridItem rowSpan={1} w="80">
              <CarbonFootprintComponent realEstateId={realEstateId} />
            </GridItem>
            <GridItem rowSpan={1} w="80">
              <NetZeroComponent />
            </GridItem>
          </Grid>
          {openedActionsCategory === 'illumination' && (
            <Grid>
              <IlluminationOverviewComponent realEstateId={realEstateId} />
            </Grid>
          )}
        </Stack>
      </Box>
    </Flex>
  );
}
