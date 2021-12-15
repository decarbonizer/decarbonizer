import { SkeletonText } from '@chakra-ui/react';
import { BiTargetLock } from 'react-icons/bi';
import { getNetZero } from '../../../calculations/global/netZero';
import { useCalculation } from '../../../calculations/useCalculation';
import HaloIcon from '../../../components/HaloIcon';
import InlineErrorDisplay from '../../../components/InlineErrorDisplay';
import { useFilledActionAnswersDataFrame } from '../action-panel/actionPanelContext';
import DashboardCard from '../components/DashboardCard';
import QuickInfo from '../components/QuickInfo';
import QuickInfoLabelDescription from '../components/QuickInfoLabelDescription';

export default function NetZeroCard() {
  const filledActionAnswersDf = useFilledActionAnswersDataFrame();
  const { isLoading, data, error } = useCalculation(
    (externalCalculationData) =>
      getNetZero(externalCalculationData, externalCalculationData.surveyAnswers, filledActionAnswersDf),
    [filledActionAnswersDf],
  );

  return (
    <DashboardCard header="Goal achieved by">
      <InlineErrorDisplay error={error}>
        {isLoading && <SkeletonText />}
        {data && (
          <QuickInfo icon={<HaloIcon icon={BiTargetLock} />}>
            <QuickInfoLabelDescription label={`${data?.newAdjustedAchievedGoal.toFixed(1)} %`} />
          </QuickInfo>
        )}
      </InlineErrorDisplay>
    </DashboardCard>
  );
}
