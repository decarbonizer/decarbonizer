import { Table, Tbody, Tr, Td, SkeletonText } from '@chakra-ui/react';
import InlineErrorDisplay from '../../../components/InlineErrorDisplay';
import { useFilledActionAnswersDataFrame } from '../dashboardContext';
import DashboardCard, { DashboardCardProps } from '../components/DashboardCard';
import { useParams } from 'react-router';
import { RealEstatePageParams } from '../../../routes';
import { KnownCategoryCoreCalculationsId } from '../../../calculations/core/coreCalculations';
import { useAsyncCalculation } from '../../../calculations/useAsyncCalculation';

export interface CalculatedCostsCardProps extends DashboardCardProps {
  coreCalculationsId: KnownCategoryCoreCalculationsId;
}

export default function CalculatedCostsCard({ coreCalculationsId, ...rest }: CalculatedCostsCardProps) {
  const { realEstateId } = useParams<RealEstatePageParams>();
  const filledActionAnswersDf = useFilledActionAnswersDataFrame();
  const { isLoading, data, error } = useAsyncCalculation(
    'getCalculatedCostsCardData',
    (externalCalculationData) => [
      coreCalculationsId,
      externalCalculationData.surveyAnswers.filter((x) => x.realEstateId === realEstateId).toArray(),
      filledActionAnswersDf.toArray(),
    ],
    [coreCalculationsId, filledActionAnswersDf, realEstateId],
  );

  return (
    <DashboardCard header="Calculated costs" showRevalidatingSpinner={isLoading} {...rest}>
      <InlineErrorDisplay error={error}>
        {!data && <SkeletonText noOfLines={6} spacing="4" />}
        {data && (
          <Table variant="" size="sm" overflowY="auto">
            <Tbody>
              {data.map((row, i) => (
                <Tr key={i} color={row.color}>
                  <Td
                    fontWeight={row.isNested ? undefined : 'bold'}
                    fontSize={row.isNested ? undefined : 'lg'}
                    pl={row.isNested ? 8 : 0}>
                    {row.title}
                  </Td>
                  <Td>{row.details}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </InlineErrorDisplay>
    </DashboardCard>
  );
}
