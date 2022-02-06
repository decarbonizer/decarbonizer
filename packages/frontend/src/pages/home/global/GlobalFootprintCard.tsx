import { SkeletonText } from '@chakra-ui/react';
import { GiFootprint } from 'react-icons/gi';
import { useAsyncCalculation } from '../../../calculations/useAsyncCalculation';
import HaloIcon from '../../../components/HaloIcon';
import InlineErrorDisplay from '../../../components/InlineErrorDisplay';
import DashboardCard from '../../dashboard/components/DashboardCard';
import QuickInfo from '../../dashboard/components/QuickInfo';
import QuickInfoLabelDescription from '../../dashboard/components/QuickInfoLabelDescription';

export default function GlobalFootprintCard() {
  const { isLoading, data, error } = useAsyncCalculation('getGlobalCompanyFootprintCardData', () => [], []);
  const carbonFootprint = data ?? 0;
  const unitSymbol = carbonFootprint >= 1000 ? 't' : 'kg';
  const adjustedFootprint = carbonFootprint >= 1000 ? carbonFootprint / 1000 : carbonFootprint;

  return (
    <DashboardCard
      header={
        <>
          Company&apos;s CO<sub>2</sub> footprint
        </>
      }
      showRevalidatingSpinner={isLoading}>
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
