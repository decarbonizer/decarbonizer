import { Heading, Image, Text, VStack } from '@chakra-ui/react';
import tree from './tree.png';
import { DataFrame } from 'data-forge';
import { ActionAnswerBase } from '../../../api/actionAnswer';
import { getTransformedFootprintPerYear } from '../../../calculations/global/footprint';
import { useCalculation } from '../../../calculations/useCalculation';

export interface CarbonTreeCardProps {
  realEstateId: string;
}

export default function CarbonTreeCard({ realEstateId }: CarbonTreeCardProps) {
  const { isLoading, data, error } = useCalculation(
    (externalCalculationData) => {
      const surveyAnswers = externalCalculationData.surveyAnswers.filter(
        (surveyAnswer) => surveyAnswer.realEstateId === realEstateId,
      );

      const carbonFootprint =
        surveyAnswers.count() > 0
          ? getTransformedFootprintPerYear(
              externalCalculationData,
              surveyAnswers,
              new DataFrame<number, ActionAnswerBase>(),
            ).globalFootprint
          : 0;
      const treeSequestrationPerYear = 21;
      const treeSequestrationPerMonth = treeSequestrationPerYear / 12;
      const calculatedTreeSequestrationPerYear = Math.round(carbonFootprint / treeSequestrationPerYear);
      const calculatedTreeSequestrationPerMonth = (carbonFootprint / treeSequestrationPerMonth).toFixed(2);
      const displayTreeSequestrationYear = `${calculatedTreeSequestrationPerYear} Tree-years`;
      const displayTreeSequestrationMonth = `${calculatedTreeSequestrationPerMonth} Tree-months`;

      return {
        calculatedTreeSequestrationPerYear,
        displayTreeSequestrationYear,
        displayTreeSequestrationMonth,
      };
    },
    [realEstateId],
  );

  return (
    <VStack>
      {data && (
        <>
          <Image boxSize="100px" src={tree} alt="Tree Image" objectFit="cover" roundedTop="md" />
          <Heading size="sm">
            {data.calculatedTreeSequestrationPerYear === 0
              ? data.displayTreeSequestrationMonth
              : data.displayTreeSequestrationYear}
          </Heading>
          <Text fontSize="sm">Carbon sequestration</Text>
        </>
      )}
    </VStack>
  );
}
