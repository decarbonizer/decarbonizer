import { HStack, SkeletonText } from '@chakra-ui/react';
import DashboardCard, { DashboardCardProps } from '../components/DashboardCard';
import QuickInfo from '../components/QuickInfo';
import QuickInfoLabelDescription from '../components/QuickInfoLabelDescription';
import { mapDeltaType } from '../../../utils/deltaType';
import HaloIcon from '../../../components/HaloIcon';
import { BiEuro } from 'react-icons/bi';
import { useFilledActionAnswersDataFrame } from '../action-panel/actionPanelContext';
import { useCalculation } from '../../../calculations/useCalculation';
import { getIlluminationElectricityCostDelta } from '../../../calculations/illumination/electricityCost';
import InlineErrorDisplay from '../../../components/InlineErrorDisplay';

export default function CostDeltaCard(props: DashboardCardProps) {
  const filledActionAnswersDf = useFilledActionAnswersDataFrame();
  const { isLoading, data, error } = useCalculation(
    (externalCalculationData) =>
      getIlluminationElectricityCostDelta(
        externalCalculationData,
        externalCalculationData.surveyAnswers,
        filledActionAnswersDf,
      ),
    [filledActionAnswersDf],
  );

  return (
    <DashboardCard header="Electricity cost delta" {...props}>
      <InlineErrorDisplay error={error}>
        <HStack>
          {isLoading && <SkeletonText />}
          {data && (
            <QuickInfo
              icon={<HaloIcon icon={BiEuro} colorScheme={mapDeltaType(data.deltaType, 'red', 'green', 'gray')} />}>
              <QuickInfoLabelDescription
                label={`${Math.abs(data.delta).toFixed(2)}€`}
                description={<>{data.deltaType === 'decrease' ? 'less' : 'more'}</>}
              />
            </QuickInfo>
          )}
        </HStack>
      </InlineErrorDisplay>
    </DashboardCard>
  );
}
