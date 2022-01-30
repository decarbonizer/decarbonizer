import { SimpleGrid, SkeletonText } from '@chakra-ui/react';
import DashboardCard, { DashboardCardProps } from '../components/DashboardCard';
import QuickInfo from '../components/QuickInfo';
import QuickInfoLabelDescription from '../components/QuickInfoLabelDescription';
import { mapDeltaType } from '../../../utils/deltaType';
import HaloIcon from '../../../components/HaloIcon';
import { BiEuro, BiTrendingDown, BiTrendingUp } from 'react-icons/bi';
import { useFilledActionAnswersDataFrame } from '../dashboardContext';
import { useCalculation } from '../../../calculations/useCalculation';
import InlineErrorDisplay from '../../../components/InlineErrorDisplay';
import { getHeatingCostDelta } from '../../../calculationsLegacy/heating/cost';
import { TiEquals } from 'react-icons/ti';

export default function CostDeltaCard(props: DashboardCardProps) {
  const filledActionAnswersDf = useFilledActionAnswersDataFrame();
  const { isLoading, data, error } = useCalculation(
    (externalCalculationData) =>
      getHeatingCostDelta(externalCalculationData, externalCalculationData.surveyAnswers, filledActionAnswersDf),
    [filledActionAnswersDf],
  );

  return (
    <DashboardCard header="Electricity cost" {...props}>
      <InlineErrorDisplay error={error}>
        {isLoading && <SkeletonText />}
        {data && (
          <SimpleGrid columns={2}>
            <QuickInfo
              icon={<HaloIcon icon={BiEuro} colorScheme={mapDeltaType(data.deltaType, 'red', 'green', 'gray')} />}>
              <QuickInfoLabelDescription
                label={`${Math.abs(data.costAfterActions).toFixed(2)}€`}
                description="heating costs per year"
              />
            </QuickInfo>
            <QuickInfo
              icon={
                <HaloIcon
                  icon={mapDeltaType(data.deltaType, BiTrendingUp, BiTrendingDown, TiEquals)}
                  colorScheme={mapDeltaType(data!.deltaType, 'red', 'green', 'gray')}
                />
              }>
              <QuickInfoLabelDescription
                label={`${Math.abs(data.delta).toFixed(2)}€`}
                description={<>{data.deltaType === 'decrease' ? 'less' : 'more'}</>}
              />
            </QuickInfo>
          </SimpleGrid>
        )}
      </InlineErrorDisplay>
    </DashboardCard>
  );
}
