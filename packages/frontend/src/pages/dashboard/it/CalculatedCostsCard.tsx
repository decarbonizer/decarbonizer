import { SkeletonText, Table, Tbody, Td, Tr } from '@chakra-ui/react';
import { useCalculation } from '../../../calculations/useCalculation';
import InlineErrorDisplay from '../../../components/InlineErrorDisplay';
import { useFilledActionAnswersDataFrame } from '../dashboardContext';
import DashboardCard, { DashboardCardProps } from '../components/DashboardCard';
import { getTransformedItCostPerYear } from '../../../calculations/it/cost';
import {
  getTransformedItFootprintPerYear,
  getTransformedProducedHeatingPerYear,
} from '../../../calculations/it/footprint';
import { useEffect } from 'react';

export default function CalculatedCostsCard(props: DashboardCardProps) {
  const filledActionAnswersDf = useFilledActionAnswersDataFrame();
  const { data, isLoading, error } = useCalculation(
    (externalCalculationData) => ({
      electricityCosts: getTransformedItCostPerYear(
        externalCalculationData,
        externalCalculationData.surveyAnswers,
        filledActionAnswersDf,
      ),
      footprint: getTransformedItFootprintPerYear(
        externalCalculationData,
        externalCalculationData.surveyAnswers,
        filledActionAnswersDf,
      ),
      producedHeating: getTransformedProducedHeatingPerYear(
        externalCalculationData.surveyAnswers,
        filledActionAnswersDf,
      ),
    }),
    [filledActionAnswersDf],
  );

  return (
    <DashboardCard header="Calculated costs" {...props}>
      <InlineErrorDisplay error={error}>
        {isLoading && <SkeletonText noOfLines={6} spacing="4" />}
        {data && (
          <Table variant="">
            <Tbody>
              <Tr>
                <Td fontWeight="bold" fontSize="lg" pl="0">
                  {data.electricityCosts.toFixed(2)}€
                </Td>
                <Td>Electricity costs per year</Td>
              </Tr>
              <Tr>
                <Td fontWeight="bold" fontSize="lg" pl="0">
                  {data.footprint.toFixed(2)}t
                </Td>
                <Td>Carbon emissions through data center</Td>
              </Tr>
              {data.producedHeating > 0 && (
                <Tr>
                  <Td fontWeight="bold" fontSize="lg" pl="0">
                    {data.producedHeating.toFixed(2)}kWh
                  </Td>
                  <Td>Heating produced by super servers</Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        )}
      </InlineErrorDisplay>
    </DashboardCard>
  );
}
