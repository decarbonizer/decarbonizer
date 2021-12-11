import { Table, Tbody, Tr, Td } from '@chakra-ui/react';
import { IlluminationCalculation } from '../../../api/surveyAnswer';
import { getIlluminationFootprintPerYear } from '../../../calculations/illumination/getIlluminationSurveyAnswerFootprintPerYear';
import { getTransformedIlluminationSurveyAnswers } from '../../../calculations/illumination/getTransformedIlluminationSurveyAnswers';
import { useCalculation } from '../../../calculations/useCalculation';
import { useFilledActionAnswersDataFrame } from '../action-panel/actionPanelContext';
import DashboardCard, { DashboardCardProps } from '../components/DashboardCard';

export interface CalculatedCostsCardProps extends DashboardCardProps {
  calculatedCosts: IlluminationCalculation;
}

export default function CalculatedCostsCard({ calculatedCosts, ...rest }: CalculatedCostsCardProps) {
  const filledActionAnswersDf = useFilledActionAnswersDataFrame();
  const { data, isLoading, error } = useCalculation((externalCalculationData) => {
    const newAnswers = getTransformedIlluminationSurveyAnswers(
      externalCalculationData.surveyAnswers,
      filledActionAnswersDf,
    );

    return getIlluminationFootprintPerYear(externalCalculationData, newAnswers);
  });

  if (isLoading || error) {
    return ':(';
  }

  return (
    <DashboardCard header="Calculated costs" {...rest}>
      <Table variant="">
        <Tbody>
          <Tr>
            <Td fontWeight="bold" fontSize="lg" pl="0">
              {calculatedCosts.amountOfIlluminants}
            </Td>
            <Td>
              <i>{calculatedCosts.typeOfBulb}</i> used
            </Td>
          </Tr>
          <Tr>
            <Td fontWeight="bold" fontSize="lg" pl="0">
              {calculatedCosts.costs}€
            </Td>
            <Td>Electricity costs</Td>
          </Tr>
          <Tr>
            <Td fontWeight="bold" fontSize="lg" pl="0">
              {data!.toFixed(2)}t
            </Td>
            <Td>Carbon emmisisons through illumination</Td>
          </Tr>
        </Tbody>
      </Table>
    </DashboardCard>
  );
}
