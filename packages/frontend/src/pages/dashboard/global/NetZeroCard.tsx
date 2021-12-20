import { SkeletonText } from '@chakra-ui/react';
import { BiTargetLock } from 'react-icons/bi';
import { useParams } from 'react-router';
import { getNetZero } from '../../../calculations/global/netZero';
import { useCalculation } from '../../../calculations/useCalculation';
import HaloIcon from '../../../components/HaloIcon';
import InlineErrorDisplay from '../../../components/InlineErrorDisplay';
import { RealEstatePageParams } from '../../../routes';
import { useFilledActionAnswersDataFrame } from '../dashboardContext';
import DashboardCard from '../components/DashboardCard';
import QuickInfo from '../components/QuickInfo';
import QuickInfoLabelDescription from '../components/QuickInfoLabelDescription';
import { mapDeltaType } from '../../../utils/deltaType';

export default function NetZeroCard() {
  const filledActionAnswersDf = useFilledActionAnswersDataFrame();
  const { realEstateId } = useParams<RealEstatePageParams>();
  const { isLoading, data, error } = useCalculation(
    (externalCalculationData) => {
      const surveyAnswers = externalCalculationData.surveyAnswers.filter(
        (surveyAnswer) => surveyAnswer.realEstateId === realEstateId,
      );
      const netZero = getNetZero(externalCalculationData, surveyAnswers, filledActionAnswersDf, realEstateId);

      return {
        netZero,
      };
    },
    [filledActionAnswersDf],
  );

  return (
    <DashboardCard header="Goal achieved by">
      <InlineErrorDisplay error={error}>
        {isLoading && <SkeletonText />}
        {data && (
          <QuickInfo
            icon={
              <HaloIcon
                icon={BiTargetLock}
                colorScheme={mapDeltaType(data.netZero.deltaType, 'red', 'green', 'gray')}
              />
            }>
            <QuickInfoLabelDescription label={`${data?.netZero.newAdjustedAchievedGoal.toFixed(1)}%`} />
          </QuickInfo>
        )}
      </InlineErrorDisplay>
    </DashboardCard>
  );
}
