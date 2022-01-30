import { SkeletonText } from '@chakra-ui/react';
import { GiFootprint } from 'react-icons/gi';
import { getTransformedFootprintPerYear } from '../../../calculations/global/footprint';
import { useCalculation } from '../../../calculations/useCalculation';
import HaloIcon from '../../../components/HaloIcon';
import InlineErrorDisplay from '../../../components/InlineErrorDisplay';
import DashboardCard from '../../dashboard/components/DashboardCard';
import QuickInfo from '../../dashboard/components/QuickInfo';
import QuickInfoLabelDescription from '../../dashboard/components/QuickInfoLabelDescription';

export default function GlobalFootprintCard() {
  const { isLoading, data, error } = useCalculation((externalCalculationData) => {
    return externalCalculationData.realEstates
      .map((realEstate) => {
        const surveyAnswersInitital = externalCalculationData.surveyAnswers.filter(
          (surveyAnswer) => surveyAnswer.realEstateId === realEstate._id,
        );
        const actionAnswers = externalCalculationData.actionPlans
          .filter((actionPlan) => actionPlan.realEstateId === realEstate._id)
          .flatMap((actionPlan) => actionPlan.actionAnswers);
        const footprint = getTransformedFootprintPerYear(
          externalCalculationData,
          surveyAnswersInitital,
          actionAnswers,
        ).globalFootprint;
        return footprint;
      })
      .reduce((a, b) => a + b, 0);
  });

  const carbonFootprint = data ?? 0;
  const unitSymbol = carbonFootprint >= 1000 ? 't' : 'kg';
  const adjustedFootprint = carbonFootprint >= 1000 ? carbonFootprint / 1000 : carbonFootprint;

  return (
    <DashboardCard
      header={
        <>
          Company&apos;s CO<sub>2</sub> footprint
        </>
      }>
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
