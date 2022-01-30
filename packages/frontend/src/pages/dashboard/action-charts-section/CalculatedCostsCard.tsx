import { Table, Tbody, Tr, Td, SkeletonText } from '@chakra-ui/react';
import { useCalculation } from '../../../calculations/useCalculation';
import InlineErrorDisplay from '../../../components/InlineErrorDisplay';
import { useFilledActionAnswersDataFrame } from '../dashboardContext';
import DashboardCard, { DashboardCardProps } from '../components/DashboardCard';
import { illuminationCoreCalculations } from '../../../calculations/core/illuminationCoreCalculations';
import { useParams } from 'react-router';
import { RealEstatePageParams } from '../../../routes';

export default function CalculatedCostsCard(props: DashboardCardProps) {
  const { realEstateId } = useParams<RealEstatePageParams>();
  const filledActionAnswersDf = useFilledActionAnswersDataFrame();
  const { data, isLoading, error } = useCalculation(
    (externalCalculationData) => ({
      electricityCosts: illuminationCoreCalculations.getTotalSummedYearlyConstantCosts(
        externalCalculationData,
        externalCalculationData.surveyAnswers.filter((x) => x.realEstateId === realEstateId),
        filledActionAnswersDf,
      ),
      footprint: illuminationCoreCalculations.getSummedYearlyFootprint(
        externalCalculationData,
        externalCalculationData.surveyAnswers.filter((x) => x.realEstateId === realEstateId),
        filledActionAnswersDf,
      ),
    }),
    [filledActionAnswersDf, realEstateId],
  );

  const bulbCalculations = useCalculation(
    (externalCalculationData) => {
      const { bulbs, surveyAnswers } = externalCalculationData;
      const transformedAnswers = illuminationCoreCalculations
        .transformSurveyAnswers(externalCalculationData, surveyAnswers, filledActionAnswersDf)
        .map((answer) => answer.value);
      const allBulbs = transformedAnswers
        .groupBy((answer) => answer.bulbType)
        .filter((group) => group.count() > 0)
        .map((group) => ({
          bulb: bulbs.filter((bulb) => bulb._id === group.first().bulbType).first(),
          count: group.map((answer) => answer.lampCount).aggregate((a, b) => a + b),
        }));
      const totalBulbs = allBulbs.map((x) => x.count).sum();

      return {
        totalBulbs,
        allBulbs,
      };
    },
    [filledActionAnswersDf],
  );

  return (
    <DashboardCard header="Calculated costs" {...props}>
      <InlineErrorDisplay error={error ?? bulbCalculations.error}>
        {(isLoading || bulbCalculations.isLoading) && <SkeletonText noOfLines={6} spacing="4" />}
        {data && bulbCalculations.data && (
          <Table variant="" size="sm" overflowY="auto">
            <Tbody>
              <Tr>
                <Td fontWeight="bold" fontSize="lg" pl="0">
                  {bulbCalculations.data.totalBulbs}
                </Td>
                <Td>bulbs used</Td>
              </Tr>
              {bulbCalculations.data.allBulbs.map((bulbStat) => (
                <Tr key={bulbStat.bulb._id}>
                  <Td pl="8">{bulbStat.count}</Td>
                  <Td>
                    <i>{bulbStat.bulb.name}</i> used
                  </Td>
                </Tr>
              ))}
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
                <Td>Carbon emissions through illumination</Td>
              </Tr>
            </Tbody>
          </Table>
        )}
      </InlineErrorDisplay>
    </DashboardCard>
  );
}
