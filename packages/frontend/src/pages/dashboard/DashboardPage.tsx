import { Box, Button, Flex, Grid, GridItem, Heading, Stack, useDisclosure } from '@chakra-ui/react';
import PopUp from './pop-up/PopUp';
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
import { PopUpContext } from './pop-up/PopUpContext';
import { FormSchema } from '../../form-engine/formSchema';
import { useState } from 'react';

export default function DashboardPage() {
  const { realEstateId } = useParams<DashboardPageParams>();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { isLoading: isLoadingSurveyAnswers, data: surveyAnswers } = useGetAllSurveyAnswersForRealEstateQuery({
    realEstateId: realEstateId,
  });
  const { isLoading: isLoadingBulbs, data: bulbs } = useGetAllBulbsQuery();
  const { isLoading: isLoadingRealEstates, data: realEstates } = useGetAllRealEstatesQuery();
  const { isLoading: isLoadingAllSurveyAnswers, data: allSurveyAnswers } = useGetAllSurveyAnswersQuery();

  const [schema, setSchema] = useState<FormSchema>(null!);

  return (
    <PopUpContext.Provider
      value={{
        onOpen: (schema: FormSchema) => {
          setSchema(schema);
          onOpen();
        },
      }}>
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
        <PopUp isOpen={isOpen} onClose={onClose} schema={schema} />
      </Flex>
    </PopUpContext.Provider>
  );
}
