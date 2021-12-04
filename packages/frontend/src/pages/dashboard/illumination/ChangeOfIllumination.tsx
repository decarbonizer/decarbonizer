import { SimpleGrid } from '@chakra-ui/react';
import { useMemo } from 'react';
import { calculateOverallFootprint, changeBulbs, GeneralCalculation } from '../../../api/surveyAnswer';
import { useGetAllBulbsQuery, useGetAllSurveyAnswersForRealEstateQuery } from '../../../store/api';
import CalculatedCosts from './CalculatedCosts';
import ReducedFootprintAndCosts from '../action-specific/ReducedFootprintAndCosts';
import ComparisonOfCosts from './ComparisonOfCosts';
import ComparisonOfOverallCosts from '../action-specific/ComparisonOfOverallCosts';
import CarbonFootprintCard from '../shared/CarbonFootprintCard';
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
  const newData = useMemo(
    () =>
      surveyAnswers && bulbs
        ? changeBulbs(surveyAnswers, bulbs, bulbId)
        : {
            newIllumination: { typeOfBulb: bulbId, amountOfIlluminants: 0, costs: 0, overallFootprint: 0 },
            reduction: { costs: 0, overallFootprint: 0 },
          },
    [surveyAnswers, bulbs, bulbId],
  );

  return (
    <SimpleGrid rows={2} gap={6} p="10">
      <SimpleGrid columns={3} gap={6}>
        <ReducedFootprintAndCosts oldCalculation={oldCalculation} reduction={newData.reduction} />
        <CarbonFootprintCard
          heading={'Reduced footprint'}
          carbonFootprint={oldCalculation.overallFootprint - newData.reduction.overallFootprint}
        />
        <CalculatedCosts calculatedCosts={newData.newIllumination} />
      </SimpleGrid>
      <SimpleGrid columns={2} gap={6}>
        <ComparisonOfCosts />
        <ComparisonOfOverallCosts />
      </SimpleGrid>
    </SimpleGrid>
  );
}
