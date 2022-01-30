import { SimpleGrid, SkeletonText } from '@chakra-ui/react';
import DashboardCard, { DashboardCardProps } from '../components/DashboardCard';
import QuickInfo from '../components/QuickInfo';
import QuickInfoLabelDescription from '../components/QuickInfoLabelDescription';
import { mapDeltaType } from '../../../utils/deltaType';
import { GiFootprint } from 'react-icons/gi';
import HaloIcon from '../../../components/HaloIcon';
import { useCalculation } from '../../../calculations/useCalculation';
import { useFilledActionAnswersDataFrame } from '../dashboardContext';
import InlineErrorDisplay from '../../../components/InlineErrorDisplay';
import { getHeatingFootprintDelta } from '../../../calculationsLegacy/heating/footprint';
import { BiTrendingUp, BiTrendingDown } from 'react-icons/bi';
import { TiEquals } from 'react-icons/ti';

export default function FootprintDeltaCard(props: DashboardCardProps) {
  const filledActionAnswersDf = useFilledActionAnswersDataFrame();
  const { isLoading, data, error } = useCalculation(
    (externalCalculationData) =>
      getHeatingFootprintDelta(externalCalculationData, externalCalculationData.surveyAnswers, filledActionAnswersDf),
    [filledActionAnswersDf],
  );

  return (
    <DashboardCard
      header={
        <>
          CO<sub>2</sub> footprint
        </>
      }
      {...props}>
      <InlineErrorDisplay error={error}>
        {isLoading && <SkeletonText />}
        {data && (
          <SimpleGrid columns={2}>
            <QuickInfo icon={<HaloIcon icon={GiFootprint} colorScheme="gray" />}>
              <QuickInfoLabelDescription
                label={`${Math.abs(data.footprintAfterActions).toFixed(2)}kg`}
                description={
                  <>
                    CO<sub>2</sub> produced per year
                  </>
                }
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
                label={`${Math.abs(data.delta).toFixed(2)}kg`}
                description={
                  <>
                    {data!.deltaType === 'decrease' ? 'less' : 'more'} CO<sub>2</sub> produced
                  </>
                }
              />
            </QuickInfo>
          </SimpleGrid>
        )}
      </InlineErrorDisplay>
    </DashboardCard>
  );
}
