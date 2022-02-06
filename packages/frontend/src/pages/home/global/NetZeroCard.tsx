import { SkeletonText } from '@chakra-ui/react';
import { BiTargetLock } from 'react-icons/bi';

import { useAsyncCalculation } from '../../../calculations/useAsyncCalculation';

import HaloIcon from '../../../components/HaloIcon';
import InlineErrorDisplay from '../../../components/InlineErrorDisplay';

import DashboardCard from '../../dashboard/components/DashboardCard';
import QuickInfo from '../../dashboard/components/QuickInfo';
import QuickInfoLabelDescription from '../../dashboard/components/QuickInfoLabelDescription';

export default function NetZeroCard() {
  const { isLoading, data, error } = useAsyncCalculation('getGlobalCompanyNetZeroCardData', () => [], []);

  return (
    <DashboardCard header="Company's goal achieved by" showRevalidatingSpinner={isLoading}>
      <InlineErrorDisplay error={error}>
        {!data && <SkeletonText />}
        {data && (
          <QuickInfo icon={<HaloIcon icon={BiTargetLock} />}>
            <QuickInfoLabelDescription label={`${data.netZeroAdjusted}%`} />
          </QuickInfo>
        )}
      </InlineErrorDisplay>
    </DashboardCard>
  );
}
