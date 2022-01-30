import { SkeletonText } from '@chakra-ui/react';
import { DataFrame } from 'data-forge';
import { BiTargetLock } from 'react-icons/bi';
import { ActionAnswerBase } from '../../../api/actionAnswer';
import { getTransformedFootprintPerYear } from '../../../calculations/global/footprint';
import { useCalculation } from '../../../calculations/useCalculation';
import HaloIcon from '../../../components/HaloIcon';
import InlineErrorDisplay from '../../../components/InlineErrorDisplay';
import { getDeltaType, mapDeltaType } from '../../../utils/deltaType';
import DashboardCard from '../../dashboard/components/DashboardCard';
import QuickInfo from '../../dashboard/components/QuickInfo';
import QuickInfoLabelDescription from '../../dashboard/components/QuickInfoLabelDescription';

export default function NetZeroCard() {
  const {
    isLoading,
    data: originalFootprintData,
    error,
  } = useCalculation((externalCalculationData) => {
    return externalCalculationData.realEstates
      .map((realEstate) => {
        const surveyAnswersInitital = externalCalculationData.surveyAnswers.filter(
          (surveyAnswer) => surveyAnswer.realEstateId === realEstate._id,
        );

        const originalFootprint = getTransformedFootprintPerYear(
          externalCalculationData,
          surveyAnswersInitital,
          new DataFrame<number, ActionAnswerBase>(),
        ).globalFootprint;
        return originalFootprint;
      })
      .reduce((a, b) => a + b, 0);
  });

  const { data: footprintAfterActionsData } = useCalculation((externalCalculationData) => {
    return externalCalculationData.realEstates
      .map((realEstate) => {
        const surveyAnswersInitital = externalCalculationData.surveyAnswers.filter(
          (surveyAnswer) => surveyAnswer.realEstateId === realEstate._id,
        );
        const actionAnswers = externalCalculationData.actionPlans
          .filter((actionPlan) => actionPlan.realEstateId === realEstate._id)
          .flatMap((actionPlan) => actionPlan.actionAnswers);
        const footprintAfterActions = getTransformedFootprintPerYear(
          externalCalculationData,
          surveyAnswersInitital,
          actionAnswers,
        ).globalFootprint;
        return footprintAfterActions;
      })
      .reduce((a, b) => a + b, 0);
  });

  const delta =
    originalFootprintData && footprintAfterActionsData ? footprintAfterActionsData - originalFootprintData : 0;
  const deltaType = getDeltaType(delta);

  const deltaAbs = delta < 0 ? Math.abs(delta) : -Math.abs(delta);

  const newAchievedGoal = originalFootprintData ? deltaAbs / (originalFootprintData / 100) : 0;

  const newAdjustedAchievedGoal = newAchievedGoal > 100 ? 100 : newAchievedGoal;

  return (
    <DashboardCard header="Company's goal achieved by">
      <InlineErrorDisplay error={error}>
        {isLoading && <SkeletonText />}
        {delta && (
          <QuickInfo
            icon={<HaloIcon icon={BiTargetLock} colorScheme={mapDeltaType(deltaType, 'red', 'green', 'gray')} />}>
            <QuickInfoLabelDescription label={`${newAdjustedAchievedGoal.toFixed(1)}%`} />
          </QuickInfo>
        )}
      </InlineErrorDisplay>
    </DashboardCard>
  );
}
