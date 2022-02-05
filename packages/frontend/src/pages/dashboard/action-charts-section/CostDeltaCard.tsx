import { SimpleGrid, SkeletonText } from '@chakra-ui/react';
import DashboardCard, { DashboardCardProps } from '../components/DashboardCard';
import QuickInfo from '../components/QuickInfo';
import QuickInfoLabelDescription from '../components/QuickInfoLabelDescription';
import { mapDeltaType } from '../../../utils/deltaType';
import HaloIcon from '../../../components/HaloIcon';
import { BiEuro, BiTrendingDown, BiTrendingUp } from 'react-icons/bi';
import {
  useFilledActionAnswersDataFrame,
  useTransformedSurveyAnswersForThisActionPlanDashboard,
} from '../dashboardContext';
import InlineErrorDisplay from '../../../components/InlineErrorDisplay';
import { TiEquals } from 'react-icons/ti';
import { useAsyncCalculation } from '../../../calculations/useAsyncCalculation';
import { KnownCategoryCoreCalculationsId } from '../../../calculations/core/coreCalculations';
import { useParams } from 'react-router';
import { RealEstatePageParams } from '../../../routes';

export interface CostDeltaCardProps extends DashboardCardProps {
  coreCalculationsId: KnownCategoryCoreCalculationsId;
}

export default function CostDeltaCard({ coreCalculationsId, ...rest }: CostDeltaCardProps) {
  const { realEstateId } = useParams<RealEstatePageParams>();
  const filledActionAnswersDf = useFilledActionAnswersDataFrame();
  const surveyAnswers = useTransformedSurveyAnswersForThisActionPlanDashboard();
  const { isLoading, data, error } = useAsyncCalculation(
    'getCostDeltaCardData',
    () => [coreCalculationsId, surveyAnswers.data!, filledActionAnswersDf.toArray()],
    { skip: !surveyAnswers.data },
    [coreCalculationsId, filledActionAnswersDf, realEstateId, surveyAnswers],
  );

  return (
    <DashboardCard header="Estimated yearly cost" showRevalidatingSpinner={isLoading} {...rest}>
      <InlineErrorDisplay error={error}>
        {!data && <SkeletonText />}
        {data && (
          <SimpleGrid columns={2}>
            <QuickInfo
              icon={
                <HaloIcon
                  icon={BiEuro}
                  colorScheme={mapDeltaType(data.yearlyConstantCostsDelta.deltaType, 'red', 'green', 'gray')}
                />
              }>
              <QuickInfoLabelDescription
                label={`${Math.abs(data.yearlyConstantCostsDelta.after).toFixed(2)}€`}
                description="generated per year"
              />
            </QuickInfo>
            <QuickInfo
              icon={
                <HaloIcon
                  icon={mapDeltaType(data.yearlyConstantCostsDelta.deltaType, BiTrendingUp, BiTrendingDown, TiEquals)}
                  colorScheme={mapDeltaType(data.yearlyConstantCostsDelta.deltaType, 'red', 'green', 'gray')}
                />
              }>
              <QuickInfoLabelDescription
                label={`${Math.abs(data.yearlyConstantCostsDelta.delta).toFixed(2)}€`}
                description={<>{data.yearlyConstantCostsDelta.deltaType === 'decrease' ? 'less' : 'more'}</>}
              />
            </QuickInfo>
          </SimpleGrid>
        )}
      </InlineErrorDisplay>
    </DashboardCard>
  );
}
