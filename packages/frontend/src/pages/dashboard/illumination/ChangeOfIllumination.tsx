import { SimpleGrid } from '@chakra-ui/react';
import { useMemo } from 'react';
import { changeBulbs, ComparisonOfCalculations, SurveyAnswer } from '../../../api/surveyAnswer';
import { useGetAllBulbsQuery, useGetAllSurveyAnswersForRealEstateQuery } from '../../../store/api';
import CalculatedCosts from './CalculatedCosts';
import ReducedFootprintAndCosts from '../action-specific/ReducedFootprintAndCosts';
import ComparisonOfOverallCosts from '../action-specific/ComparisonOfOverallCosts';
import CarbonFootprintCard from '../shared/CarbonFootprintCard';
import ComparisonOfCostsAndFootprints from './ComparisonOfCostsAndFootprints';
import { IlluminationSurveyAnswerValue } from '../../../data/surveys/illumination/illuminationSurveyAnswerValue';

interface ChangeOfIlluminationProps {
  realEstateId: string;
  bulbId: string;
}

export default function ChangeOfIllumination({ realEstateId, bulbId }: ChangeOfIlluminationProps) {
  const { data: surveyAnswers } = useGetAllSurveyAnswersForRealEstateQuery({
    realEstateId: realEstateId,
  });
  const { data: bulbs } = useGetAllBulbsQuery();

  const newData = useMemo(
    () =>
      surveyAnswers && bulbs
        ? changeBulbs(surveyAnswers as SurveyAnswer<IlluminationSurveyAnswerValue>[], bulbs, bulbId)
        : {
            newIllumination: { typeOfBulb: bulbId, amountOfIlluminants: 0, costs: 0, overallFootprint: 0 },
            oldCalculation: [{ costs: 0, footprint: 0, year: 0 }],
            newCalculation: [{ costs: 0, footprint: 0, year: 0 }],
          },
    [surveyAnswers, bulbs, bulbId],
  );

  const dataForComparison: ComparisonOfCalculations[] = prepareDataForComparison();
  const footprintReduction: number = newData
    ? newData.oldCalculation[0].footprint - newData.newCalculation[0].footprint
    : 0;

  function prepareDataForComparison(): ComparisonOfCalculations[] {
    if (newData) {
      return newData.oldCalculation.map((item) => {
        const item2 = newData.newCalculation.find((calc) => calc.year == item.year);
        return {
          year: item.year,
          oldCosts: item.costs,
          oldFootprint: item.footprint,
          newCosts: item2!.costs,
          newFootprint: item2!.footprint,
        };
      });
    } else {
      return [{ year: 0, oldCosts: 0, oldFootprint: 0, newCosts: 0, newFootprint: 0 }];
    }
  }

  return (
    <SimpleGrid rows={2} gap={6} p="4">
      <SimpleGrid columns={3} gap={6}>
        <ReducedFootprintAndCosts
          oldCalculation={newData.oldCalculation[0]}
          newCalculation={newData.newCalculation[0]}
        />
        <CarbonFootprintCard
          heading={footprintReduction > 0 ? 'Reduced footprint' : 'Increased footprint'}
          carbonFootprint={Math.abs(footprintReduction)}
        />
        <CalculatedCosts calculatedCosts={newData.newIllumination} />
      </SimpleGrid>
      <SimpleGrid columns={2} gap={6}>
        <ComparisonOfCostsAndFootprints data={dataForComparison} />
        <ComparisonOfOverallCosts />
      </SimpleGrid>
    </SimpleGrid>
  );
}
