import { SkeletonText } from '@chakra-ui/skeleton';
import { GiFootprint } from 'react-icons/gi';
import HaloIcon from '../../../components/HaloIcon';
import InlineErrorDisplay from '../../../components/InlineErrorDisplay';
import {
  useFilledActionAnswersDataFrame,
  useTransformedSurveyAnswersForThisActionPlanDashboard,
} from '../dashboardContext';
import DashboardCard, { DashboardCardProps } from '../components/DashboardCard';
import QuickInfo from '../components/QuickInfo';
import QuickInfoLabelDescription from '../components/QuickInfoLabelDescription';
import { useAsyncCalculation } from '../../../calculations/useAsyncCalculation';

export default function GlobalFootprintCard(props: DashboardCardProps) {
  const filledActionAnswersDf = useFilledActionAnswersDataFrame();
  const surveyAnswers = useTransformedSurveyAnswersForThisActionPlanDashboard();
  const { isLoading, data, error } = useAsyncCalculation(
    'getGlobalRealEstateFootprintCardData',
    () => [surveyAnswers.data!, filledActionAnswersDf.toArray()],
    { skip: !surveyAnswers.data },
    [filledActionAnswersDf, surveyAnswers],
  );

  const carbonFootprint = data ?? 0;
  const unitSymbol = carbonFootprint >= 1000 ? 't' : 'kg';
  const adjustedFootprint = carbonFootprint >= 1000 ? carbonFootprint / 1000 : carbonFootprint;

  return (
    <DashboardCard
      header={
        <>
          This real estate&apos;s CO<sub>2</sub> footprint
        </>
      }
      showRevalidatingSpinner={isLoading}
      {...props}>
      <InlineErrorDisplay error={error}>
        {!data && <SkeletonText />}
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
