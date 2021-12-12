import { Table, Tbody, Tr, Td, SkeletonText } from '@chakra-ui/react';
import { IlluminationCalculation } from '../../../api/surveyAnswer';
import { getTransformedIlluminationElectricityCostPerYear } from '../../../calculations/illumination/electricityCost';
import { getTransformedIlluminationFootprintPerYear } from '../../../calculations/illumination/footprint';
import { useCalculation } from '../../../calculations/useCalculation';
import InlineErrorDisplay from '../../../components/InlineErrorDisplay';
import { useFilledActionAnswersDataFrame } from '../action-panel/actionPanelContext';
import DashboardCard, { DashboardCardProps } from '../components/DashboardCard';

export interface CalculatedCostsCardProps extends DashboardCardProps {
  calculatedCosts: IlluminationCalculation;
}

export default function CalculatedCostsCard({ calculatedCosts, ...rest }: CalculatedCostsCardProps) {
  const filledActionAnswersDf = useFilledActionAnswersDataFrame();
  const { data, isLoading, error } = useCalculation(
    (externalCalculationData) => ({
      electricityCosts: getTransformedIlluminationElectricityCostPerYear(
        externalCalculationData,
        externalCalculationData.surveyAnswers,
        filledActionAnswersDf,
      ),
      footprint: getTransformedIlluminationFootprintPerYear(
        externalCalculationData,
        externalCalculationData.surveyAnswers,
        filledActionAnswersDf,
      ),
    }),
    [filledActionAnswersDf],
  );

  return (
    <DashboardCard header="Calculated costs" {...rest}>
      <InlineErrorDisplay error={error}>
        {isLoading && <SkeletonText noOfLines={6} spacing="4" />}
        {data && (
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
                  {data.electricityCosts.toFixed(2)}€
                </Td>
                <Td>Electricity costs per year</Td>
              </Tr>
              <Tr>
                <Td fontWeight="bold" fontSize="lg" pl="0">
                  {data.footprint.toFixed(2)}t
                </Td>
                <Td>Carbon emmisisons through illumination</Td>
              </Tr>
            </Tbody>
          </Table>
        )}
      </InlineErrorDisplay>
    </DashboardCard>
  );
}
