import { SkeletonText } from '@chakra-ui/react';
import DashboardCard, { DashboardCardProps } from '../components/DashboardCard';
import QuickInfo from '../components/QuickInfo';
import QuickInfoLabelDescription from '../components/QuickInfoLabelDescription';
import { mapDeltaType } from '../../../utils/deltaType';
import { GiFootprint } from 'react-icons/gi';
import HaloIcon from '../../../components/HaloIcon';
import { useCalculation } from '../../../calculations/useCalculation';
import { useFilledActionAnswersDataFrame } from '../action-panel/actionPanelContext';
import InlineErrorDisplay from '../../../components/InlineErrorDisplay';
import { getElectricityFootprintDelta } from '../../../calculations/electricity/footprint';

export default function FootprintDeltaCard(props: DashboardCardProps) {
  const filledActionAnswersDf = useFilledActionAnswersDataFrame();
  const { isLoading, data, error } = useCalculation(
    (externalCalculationData) =>
      getElectricityFootprintDelta(
        externalCalculationData,
        externalCalculationData.surveyAnswers,
        filledActionAnswersDf,
      ),
    [filledActionAnswersDf],
  );

  return (
    <DashboardCard
      header={
        <>
          CO<sub>2</sub> footprint delta
        </>
      }
      {...props}>
      <InlineErrorDisplay error={error}>
        {isLoading && <SkeletonText />}
        {data && (
          <QuickInfo
            icon={<HaloIcon icon={GiFootprint} colorScheme={mapDeltaType(data!.deltaType, 'red', 'green', 'gray')} />}>
            <QuickInfoLabelDescription
              label={`${Math.abs(data.delta).toFixed(2)}kg`}
              description={
                <>
                  {data!.deltaType === 'decrease' ? 'less' : 'more'} CO<sub>2</sub> produced
                </>
              }
            />
          </QuickInfo>
        )}
      </InlineErrorDisplay>
    </DashboardCard>
  );
}