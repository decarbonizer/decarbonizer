import { SkeletonText, Table, Tbody, Td, Tr, Text } from '@chakra-ui/react';
import { useCalculation } from '../../../calculations/useCalculation';
import InlineErrorDisplay from '../../../components/InlineErrorDisplay';
import { useFilledActionAnswersDataFrame } from '../dashboardContext';
import DashboardCard, { DashboardCardProps } from '../components/DashboardCard';
import { getTransformedHeatingCostPerYear } from '../../../calculations/heating/cost';
import { getTransformedHeatingFootprintPerYear } from '../../../calculations/heating/footprint';
import { getTransformedProducedHeatingPerYear } from '../../../calculations/it/footprint';

export default function CalculatedCostsCard(props: DashboardCardProps) {
  const filledActionAnswersDf = useFilledActionAnswersDataFrame();
  const { data, isLoading, error } = useCalculation(
    (externalCalculationData) => {
      return {
        producedHeating: getTransformedProducedHeatingPerYear(
          externalCalculationData.surveyAnswers,
          filledActionAnswersDf,
        ),
        footprint: getTransformedHeatingFootprintPerYear(
          externalCalculationData,
          externalCalculationData.surveyAnswers,
          filledActionAnswersDf,
        ),
        heatingCosts: getTransformedHeatingCostPerYear(
          externalCalculationData,
          externalCalculationData.surveyAnswers,
          filledActionAnswersDf,
        ),
      };
    },
    [filledActionAnswersDf],
  );

  return (
    <DashboardCard header="Calculated costs" {...props}>
      <InlineErrorDisplay error={error}>
        {isLoading && <SkeletonText noOfLines={6} spacing="4" />}
        {data && (
          <>
            <Table variant="">
              <Tbody>
                <Tr>
                  <Td fontWeight="bold" fontSize="lg" pl="0">
                    {data.heatingCosts.toFixed(2)}€
                  </Td>
                  <Td>Heating costs per year</Td>
                </Tr>
                <Tr>
                  <Td fontWeight="bold" fontSize="lg" pl="0">
                    {data.footprint.toFixed(2)}t
                  </Td>
                  <Td>Carbon emissions through heating</Td>
                </Tr>
                {data.producedHeating > 0 ? (
                  <Tr>
                    <Td fontWeight="bold" fontSize="lg" pl="0">
                      {data.producedHeating.toFixed(2)}kWh
                    </Td>
                    <Td>Heating compensated by data center</Td>
                  </Tr>
                ) : (
                  <></>
                )}
              </Tbody>
            </Table>
            {data.heatingCosts === 0 && data.footprint === 0 && (
              <Text color="green">
                Produced heating by data center completely compensates current heating costs and footprint
              </Text>
            )}
          </>
        )}
      </InlineErrorDisplay>
    </DashboardCard>
  );
}
