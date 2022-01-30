import { Table, Tbody, Tr, Td, SkeletonText } from '@chakra-ui/react';
import { getTransformedIlluminationElectricityCostPerYear } from '../../../calculationsLegacy/illumination/electricityCost';
import { getTransformedIlluminationFootprintPerYear } from '../../../calculationsLegacy/illumination/footprint';
import { transformIlluminationSurveyAnswers } from '../../../calculationsLegacy/illumination/transformation';
import { getSurveyAnswersForSurvey } from '../../../calculationsLegacy/surveyAnswers/getSurveyAnswersForSurvey';
import { useCalculation } from '../../../calculations/useCalculation';
import InlineErrorDisplay from '../../../components/InlineErrorDisplay';
import { useFilledActionAnswersDataFrame } from '../dashboardContext';
import DashboardCard, { DashboardCardProps } from '../components/DashboardCard';

export default function CalculatedCostsCard(props: DashboardCardProps) {
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

  const bulbCalculations = useCalculation(
    ({ bulbs, surveyAnswers }) => {
      const illuminationAnswers = getSurveyAnswersForSurvey(surveyAnswers, 'illumination');
      const transformedAnswers = transformIlluminationSurveyAnswers(illuminationAnswers, filledActionAnswersDf);
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
