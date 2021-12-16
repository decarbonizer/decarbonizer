import { SkeletonText } from '@chakra-ui/skeleton';
import { DataFrame } from 'data-forge';
import { GiFootprint } from 'react-icons/gi';
import { useParams } from 'react-router';
import { getTransformedFootprintPerYear } from '../../../calculations/global/footprint';
import { useCalculation } from '../../../calculations/useCalculation';
import HaloIcon from '../../../components/HaloIcon';
import InlineErrorDisplay from '../../../components/InlineErrorDisplay';
import { RealEstatePageParams } from '../../../routes';
import { useFilledActionAnswersDataFrame } from '../dashboardContext';
import DashboardCard, { DashboardCardProps } from '../components/DashboardCard';
import QuickInfo from '../components/QuickInfo';
import QuickInfoLabelDescription from '../components/QuickInfoLabelDescription';

export default function GlobalFootprintCard(props: DashboardCardProps) {
  const filledActionAnswersDf = useFilledActionAnswersDataFrame();
  const { realEstateId } = useParams<RealEstatePageParams>();
  const { isLoading, data, error } = useCalculation(
    (externalCalculationData) => {
      const surveyAnswers = externalCalculationData.surveyAnswers.filter(
        (surveyAnswer) => surveyAnswer.realEstateId === realEstateId,
      );
      const actionAnswers = externalCalculationData.actionPlans
        .filter((actionPlan) => actionPlan.realEstateId === realEstateId)
        .flatMap((actionPlan) => actionPlan.actionAnswers);

      const allActionAnswers = actionAnswers ? [...actionAnswers, ...filledActionAnswersDf] : filledActionAnswersDf;
      const footprint = getTransformedFootprintPerYear(
        externalCalculationData,
        surveyAnswers,
        new DataFrame(allActionAnswers),
      );
      return {
        footprint,
      };
    },
    [filledActionAnswersDf],
  );

  const carbonFootprint = data?.footprint.globalFootprint ?? 0;
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
