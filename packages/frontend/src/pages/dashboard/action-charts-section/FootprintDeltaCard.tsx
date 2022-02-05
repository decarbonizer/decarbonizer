import { SkeletonText, SimpleGrid } from '@chakra-ui/react';
import DashboardCard, { DashboardCardProps } from '../components/DashboardCard';
import QuickInfo from '../components/QuickInfo';
import QuickInfoLabelDescription from '../components/QuickInfoLabelDescription';
import { mapDeltaType } from '../../../utils/deltaType';
import { GiFootprint } from 'react-icons/gi';
import HaloIcon from '../../../components/HaloIcon';
import {
  useFilledActionAnswersDataFrame,
  useTransformedSurveyAnswersForThisActionPlanDashboard,
} from '../dashboardContext';
import InlineErrorDisplay from '../../../components/InlineErrorDisplay';
import { BiTrendingDown, BiTrendingUp } from 'react-icons/bi';
import { TiEquals } from 'react-icons/ti';
import { useAsyncCalculation } from '../../../calculations/useAsyncCalculation';
import { KnownCategoryCoreCalculationsId } from '../../../calculations/core/coreCalculations';

export interface FootprintDeltaCardProps extends DashboardCardProps {
  coreCalculationsId: KnownCategoryCoreCalculationsId;
}

export default function FootprintDeltaCard({ coreCalculationsId, ...rest }: FootprintDeltaCardProps) {
  const filledActionAnswersDf = useFilledActionAnswersDataFrame();
  const surveyAnswers = useTransformedSurveyAnswersForThisActionPlanDashboard();
  const { isLoading, data, error } = useAsyncCalculation(
    'getFootprintDeltaCardData',
    () => [coreCalculationsId, surveyAnswers.data!, filledActionAnswersDf.toArray()],
    { skip: !surveyAnswers.data },
    [coreCalculationsId, filledActionAnswersDf, surveyAnswers],
  );

  return (
    <DashboardCard
      header={
        <>
          CO<sub>2</sub> footprint
        </>
      }
      showRevalidatingSpinner={isLoading}
      {...rest}>
      <InlineErrorDisplay error={error}>
        {!data && <SkeletonText />}
        {data && (
          <SimpleGrid columns={2}>
            <QuickInfo icon={<HaloIcon icon={GiFootprint} colorScheme="gray" />}>
              <QuickInfoLabelDescription
                label={`${Math.abs(data.summedYearlyFootprintDelta.after).toFixed(2)}kg`}
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
                  icon={mapDeltaType(data.summedYearlyFootprintDelta.deltaType, BiTrendingUp, BiTrendingDown, TiEquals)}
                  colorScheme={mapDeltaType(data.summedYearlyFootprintDelta.deltaType, 'red', 'green', 'gray')}
                />
              }>
              <QuickInfoLabelDescription
                label={`${Math.abs(data.summedYearlyFootprintDelta.delta).toFixed(2)}kg`}
                description={
                  <>
                    {data.summedYearlyFootprintDelta.deltaType === 'decrease' ? 'less' : 'more'} CO<sub>2</sub> produced
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
