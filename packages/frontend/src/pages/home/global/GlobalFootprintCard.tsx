import { SkeletonText } from '@chakra-ui/react';
import { GiFootprint } from 'react-icons/gi';
import { getGlobalFootprintForAllRealEstates } from '../../../calculations/calculations/getGlobalSummedYearlyFootprint';
import { useCalculation } from '../../../calculations/useCalculation';
import HaloIcon from '../../../components/HaloIcon';
import InlineErrorDisplay from '../../../components/InlineErrorDisplay';
import DashboardCard from '../../dashboard/components/DashboardCard';
import QuickInfo from '../../dashboard/components/QuickInfo';
import QuickInfoLabelDescription from '../../dashboard/components/QuickInfoLabelDescription';

export default function GlobalFootprintCard() {
  const { isLoading, data, error } = useCalculation((externalCalculationData) =>
    getGlobalFootprintForAllRealEstates(externalCalculationData),
  );

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
