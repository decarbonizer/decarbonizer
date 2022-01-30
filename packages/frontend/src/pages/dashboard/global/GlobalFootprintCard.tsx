import { SkeletonText } from '@chakra-ui/skeleton';
import { GiFootprint } from 'react-icons/gi';
import { useParams } from 'react-router';
import {
  getGlobalSummedYearlyFootprint,
  getGlobalSummedYearlyFootprintDelta,
} from '../../../calculations/calculations/getGlobalSummedYearlyFootprint';
import { useCalculation } from '../../../calculations/useCalculation';
import HaloIcon from '../../../components/HaloIcon';
import InlineErrorDisplay from '../../../components/InlineErrorDisplay';
import { RealEstatePageParams } from '../../../routes';
import { useFilledActionAnswersDataFrame } from '../dashboardContext';
import DashboardCard, { DashboardCardProps } from '../components/DashboardCard';
import QuickInfo from '../components/QuickInfo';
import QuickInfoLabelDescription from '../components/QuickInfoLabelDescription';
import { DataFrame } from 'data-forge';

export default function GlobalFootprintCard(props: DashboardCardProps) {
  const filledActionAnswersDf = useFilledActionAnswersDataFrame();
  const { realEstateId } = useParams<RealEstatePageParams>();
  const { isLoading, data, error } = useCalculation(
    (externalCalculationData) => {
      const surveyAnswers = externalCalculationData.surveyAnswers.filter(
        (surveyAnswer) => surveyAnswer.realEstateId === realEstateId && surveyAnswer.value.isInitialSurvey,
      );
      const actionPlansRealEstate = externalCalculationData.actionPlans.filter(
        (actionPlan) => actionPlan.realEstateId === realEstateId,
      );
      const originalFootprint = getGlobalSummedYearlyFootprint(externalCalculationData, surveyAnswers);

      const actionPlanFootprints = actionPlansRealEstate
        .map((actionPlan) => {
          const footprintActionPlan = getGlobalSummedYearlyFootprintDelta(
            externalCalculationData,
            surveyAnswers,
            new DataFrame(actionPlan.actionAnswers),
          ).delta;
          return footprintActionPlan;
        })
        .reduce((a, b) => a + b, 0);

      const footprintAction = getGlobalSummedYearlyFootprintDelta(
        externalCalculationData,
        surveyAnswers,
        filledActionAnswersDf,
      ).delta;

      const overallFootprint = originalFootprint + footprintAction + actionPlanFootprints;

      return {
        overallFootprint,
      };
    },
    [filledActionAnswersDf],
  );

  const carbonFootprint = data?.overallFootprint ?? 0;
  const unitSymbol = carbonFootprint >= 1000 ? 't' : 'kg';
  const adjustedFootprint = carbonFootprint >= 1000 ? carbonFootprint / 1000 : carbonFootprint;

  return (
    <DashboardCard
      header={
        <>
          This real estate&apos;s CO<sub>2</sub> footprint
        </>
      }
      {...props}>
      <InlineErrorDisplay error={error}>
        {isLoading && <SkeletonText />}
        {data && (
          <QuickInfo icon={<HaloIcon icon={GiFootprint} />}>
            <QuickInfoLabelDescription
              label={
                <>
                  {adjustedFootprint.toFixed(1)}
                  {unitSymbol}
                </>
              }
            />
          </QuickInfo>
        )}
      </InlineErrorDisplay>
    </DashboardCard>
  );
}
