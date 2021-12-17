import { SkeletonText, Table, Tbody, Td, Tr } from '@chakra-ui/react';
import { useCalculation } from '../../../calculations/useCalculation';
import InlineErrorDisplay from '../../../components/InlineErrorDisplay';
import { useFilledActionAnswersDataFrame } from '../dashboardContext';
import DashboardCard, { DashboardCardProps } from '../components/DashboardCard';
import { getTransformedElectricityCostPerYear } from '../../../calculations/electricity/cost';
import { getTransformedElectricityFootprintPerYear } from '../../../calculations/electricity/footprint';

export default function CalculatedCostsCard(props: DashboardCardProps) {
  const filledActionAnswersDf = useFilledActionAnswersDataFrame();
  const { data, isLoading, error } = useCalculation(
    (externalCalculationData) => ({
      electricityCosts: getTransformedElectricityCostPerYear(
        externalCalculationData,
        externalCalculationData.surveyAnswers,
        filledActionAnswersDf,
      ),
      footprint: getTransformedElectricityFootprintPerYear(
        externalCalculationData,
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
                <Td>Carbon emissions through electricity</Td>
              </Tr>
            </Tbody>
          </Table>
        )}
      </InlineErrorDisplay>
    </DashboardCard>
  );
}
