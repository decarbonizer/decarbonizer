import { SkeletonText, Table, Tbody, Td, Tr } from '@chakra-ui/react';
import { useCalculation } from '../../../calculations/useCalculation';
import InlineErrorDisplay from '../../../components/InlineErrorDisplay';
import { useFilledActionAnswersDataFrame } from '../dashboardContext';
import DashboardCard, { DashboardCardProps } from '../components/DashboardCard';
import {
  getTransformedHeatingCostPerYear,
  getTransformedHeatingInstallationCostPerYear,
} from '../../../calculations/heating/cost';
import { getTransformedHeatingFootprintPerYear } from '../../../calculations/heating/footprint';
import { getSurveyAnswersForSurvey } from '../../../calculations/surveyAnswers/getSurveyAnswersForSurvey';
import { transformHeatingSurveyAnswers } from '../../../calculations/heating/transformation';

export default function CalculatedCostsCard(props: DashboardCardProps) {
  const filledActionAnswersDf = useFilledActionAnswersDataFrame();
  const { data, isLoading, error } = useCalculation(
    (externalCalculationData) => {
      return {
        heatingCosts: getTransformedHeatingCostPerYear(
          externalCalculationData,
          externalCalculationData.surveyAnswers,
          filledActionAnswersDf,
        ),
        footprint: getTransformedHeatingFootprintPerYear(
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
            </Tbody>
          </Table>
        )}
      </InlineErrorDisplay>
    </DashboardCard>
  );
}
