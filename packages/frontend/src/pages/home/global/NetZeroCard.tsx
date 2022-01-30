import { SkeletonText } from '@chakra-ui/react';
import { DataFrame } from 'data-forge';
import { BiTargetLock } from 'react-icons/bi';
import {
  getGlobalSummedYearlyFootprint,
  getGlobalSummedYearlyFootprintDelta,
} from '../../../calculations/calculations/getGlobalSummedYearlyFootprint';
import { useCalculation } from '../../../calculations/useCalculation';
import HaloIcon from '../../../components/HaloIcon';
import InlineErrorDisplay from '../../../components/InlineErrorDisplay';
import { getDeltaType, mapDeltaType } from '../../../utils/deltaType';
import DashboardCard from '../../dashboard/components/DashboardCard';
import QuickInfo from '../../dashboard/components/QuickInfo';
import QuickInfoLabelDescription from '../../dashboard/components/QuickInfoLabelDescription';

export default function NetZeroCard() {
  const { isLoading, data, error } = useCalculation((externalCalculationData) => {
    const originalFootprint = externalCalculationData.realEstates
      .map((realEstate) => {
        const surveyAnswersInitital = externalCalculationData.surveyAnswers.filter(
          (surveyAnswer) => surveyAnswer.realEstateId === realEstate._id,
        );

        const originalFootprint = getGlobalSummedYearlyFootprint(externalCalculationData, surveyAnswersInitital);
        return originalFootprint;
      })
      .reduce((a, b) => a + b, 0);

    const realEstatesAfterActionPlans = externalCalculationData.realEstates.map((realEstate) =>
      externalCalculationData.actionPlans.filter((actionPlan) => actionPlan.realEstateId === realEstate._id),
    );

    const footprintRealEstateActionPlans = realEstatesAfterActionPlans
      .map((actionPlans) => {
        const footPrintDeltaRealEstate = actionPlans
          .map((actionPlan) => {
            const surveyAnswersInitital = externalCalculationData.surveyAnswers.filter(
              (surveyAnswer) =>
                surveyAnswer.realEstateId === actionPlan.realEstateId && surveyAnswer.value.isInitialSurvey,
            );
            const footprintActionPlan = getGlobalSummedYearlyFootprintDelta(
              externalCalculationData,
              surveyAnswersInitital,
              new DataFrame(actionPlan.actionAnswers),
            ).delta;
            return footprintActionPlan;
          })
          .reduce((a, b) => a + b, 0);
        return footPrintDeltaRealEstate;
      })
      .reduce((a, b) => a + b, 0);

    return { originalFootprint, footprintRealEstateActionPlans };
  });

  const delta = data ? data.footprintRealEstateActionPlans : 0;

  const deltaType = getDeltaType(delta);

  const deltaAbs = delta < 0 ? Math.abs(delta) : -Math.abs(delta);

  const newAchievedGoal = data?.originalFootprint ? deltaAbs / (data.originalFootprint / 100) : 0;

  const newAdjustedAchievedGoal = newAchievedGoal > 100 ? 100 : newAchievedGoal;

  return (
    <DashboardCard header="Company's goal achieved by">
      <InlineErrorDisplay error={error}>
        {isLoading && <SkeletonText />}
        {data && (
          <QuickInfo
            icon={<HaloIcon icon={BiTargetLock} colorScheme={mapDeltaType(deltaType, 'red', 'green', 'gray')} />}>
            <QuickInfoLabelDescription label={`${newAdjustedAchievedGoal.toFixed(1)}%`} />
          </QuickInfo>
        )}
      </InlineErrorDisplay>
    </DashboardCard>
  );
}
