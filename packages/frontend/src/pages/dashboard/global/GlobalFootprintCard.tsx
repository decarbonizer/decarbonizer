import { SkeletonText } from '@chakra-ui/skeleton';
import { GiFootprint } from 'react-icons/gi';
import { getTransformedFootprintPerYear } from '../../../calculations/global/footprint';
import { useCalculation } from '../../../calculations/useCalculation';
import HaloIcon from '../../../components/HaloIcon';
import InlineErrorDisplay from '../../../components/InlineErrorDisplay';
import { useFilledActionAnswersDataFrame } from '../action-panel/actionPanelContext';
import DashboardCard, { DashboardCardProps } from '../components/DashboardCard';
import QuickInfo from '../components/QuickInfo';
import QuickInfoLabelDescription from '../components/QuickInfoLabelDescription';

export default function GlobalFootprintCard(props: DashboardCardProps) {
  const filledActionAnswersDf = useFilledActionAnswersDataFrame();
  const { isLoading, data, error } = useCalculation(
    (externalCalculationData) =>
      getTransformedFootprintPerYear(
        externalCalculationData,
        externalCalculationData.surveyAnswers,
        filledActionAnswersDf,
      ),
    [filledActionAnswersDf],
  );
  const carbonFootprint = data?.globalFootprint ?? 0;
  const unitSymbol = carbonFootprint >= 1000 ? 't' : 'kg';
  const adjustedFootprint = carbonFootprint >= 1000 ? carbonFootprint / 1000 : carbonFootprint;

  return (
    <DashboardCard
      header={
        <>
          CO<sub>2</sub> footprint
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
