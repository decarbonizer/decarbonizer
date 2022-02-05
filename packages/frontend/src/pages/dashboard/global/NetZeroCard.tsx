import { SkeletonText } from '@chakra-ui/react';
import { BiTargetLock } from 'react-icons/bi';
import { useParams } from 'react-router';
import HaloIcon from '../../../components/HaloIcon';
import InlineErrorDisplay from '../../../components/InlineErrorDisplay';
import { RealEstatePageParams } from '../../../routes';
import {
  useFilledActionAnswersDataFrame,
  useTransformedSurveyAnswersForThisActionPlanDashboard,
} from '../dashboardContext';
import DashboardCard from '../components/DashboardCard';
import QuickInfo from '../components/QuickInfo';
import QuickInfoLabelDescription from '../components/QuickInfoLabelDescription';
import { mapDeltaType } from '../../../utils/deltaType';
import { useAsyncCalculation } from '../../../calculations/useAsyncCalculation';

export default function NetZeroCard() {
  const filledActionAnswersDf = useFilledActionAnswersDataFrame();
  const { realEstateId } = useParams<RealEstatePageParams>();
  const surveyAnswers = useTransformedSurveyAnswersForThisActionPlanDashboard();
  const { isLoading, data, error } = useAsyncCalculation(
    'getNetZero',
    () => [surveyAnswers.data!, realEstateId, filledActionAnswersDf.toArray()],
    { skip: !surveyAnswers.data },
    [filledActionAnswersDf, realEstateId, surveyAnswers],
  );

  return (
    <DashboardCard header="Goal achieved by" showRevalidatingSpinner={isLoading}>
      <InlineErrorDisplay error={error}>
        {!data && <SkeletonText />}
        {data && (
          <QuickInfo
            icon={<HaloIcon icon={BiTargetLock} colorScheme={mapDeltaType(data.deltaType, 'green', 'red', 'gray')} />}>
            <QuickInfoLabelDescription label={`${data.newAdjustedAchievedGoal}%`} />
          </QuickInfo>
        )}
      </InlineErrorDisplay>
    </DashboardCard>
  );
}
