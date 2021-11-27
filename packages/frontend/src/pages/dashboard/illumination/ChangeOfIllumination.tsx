import { Grid, GridItem } from '@chakra-ui/react';
import { useMemo } from 'react';
import {
  calculateOverallFootprint,
  changeBulbs,
  GeneralCalculation,
  IlluminationCalculation,
} from '../../../api/surveyAnswer';
import { useGetAllBulbsQuery, useGetAllSurveyAnswersForRealEstateQuery } from '../../../store/api';
import CalculatedCosts from './CalculatedCosts';
import ReducedFootprintAndCosts from '../action-specific/ReducedFootprintAndCosts';
import CarbonFootprintComponent from '../CarbonFootprint';
interface ChangeOfIlluminationProps {
  realEstateId: string;
  bulbId: string;
}
export default function ChangeOfIllumination({ realEstateId, bulbId }: ChangeOfIlluminationProps) {
  const { data: surveyAnswers } = useGetAllSurveyAnswersForRealEstateQuery({
    realEstateId: realEstateId,
  });
  const { data: bulbs } = useGetAllBulbsQuery();

  const oldCalculation: GeneralCalculation = useMemo(
    () =>
      surveyAnswers && bulbs ? calculateOverallFootprint(surveyAnswers, bulbs) : { costs: 0, overallFootprint: 0 },
    [surveyAnswers, bulbs],
  );
  const newIllumination: IlluminationCalculation = useMemo(
    () =>
      surveyAnswers && bulbs
        ? changeBulbs(surveyAnswers, bulbs, bulbId)
        : { typeOfBulb: bulbId, amountOfIlluminants: 0, costs: 0, overallFootprint: 0 },
    [surveyAnswers, bulbs, bulbId],
  );

  return (
    <Grid p={4} h="370px" templateRows="repeat(2, 1fr)" templateColumns="repeat(5, 1fr)" gap={4}>
      <GridItem rowSpan={2} colSpan={1}>
        <ReducedFootprintAndCosts oldCalculation={oldCalculation} newIllumination={newIllumination} />{' '}
      </GridItem>
      <GridItem colSpan={2}>
        <CarbonFootprintComponent heading={'Reduced footprint'} carbonFootprint={newIllumination.overallFootprint} />{' '}
      </GridItem>
      <GridItem colSpan={2}>
        <CalculatedCosts calculatedCosts={newIllumination} />
      </GridItem>
      <GridItem colSpan={4} bg="tomato" />
    </Grid>
  );
}
