import { Grid } from '@chakra-ui/react';
import CalculatedCostsCard from './CalculatedCostsCard';
import FootprintDeltaCard from './FootprintDeltaCard';
import FootprintComparisonChartCard from './FootprintComparisonChartCard';
import CostDeltaCard from './CostDeltaCard';
import CostComparisonChartCard from './CostComparisonChartCard';
import { useContext } from 'react';
import { DashboardContext } from '../dashboardContext';
import { KnownCategoryCoreCalculationsId } from '../../../calculations/core/coreCalculations';

export interface ActionChartsSectionProps {
  isNarrow: boolean;
}

export default function ActionChartsSection({ isNarrow }: ActionChartsSectionProps) {
  const { selectedActionCategory } = useContext(DashboardContext);
  const coreCalculationsId = (selectedActionCategory?.id ?? '') as KnownCategoryCoreCalculationsId;

  return (
    <Grid
      flexGrow={1}
      templateRows={isNarrow ? 'auto auto 20rem 20rem 20rem' : 'auto auto 1fr'}
      templateColumns={isNarrow ? '1fr' : '1fr 1fr'}
      gap="6">
      <FootprintDeltaCard coreCalculationsId={coreCalculationsId} />
      <CostDeltaCard gridRow={isNarrow ? undefined : '2'} coreCalculationsId={coreCalculationsId} />
      <CalculatedCostsCard gridRow={isNarrow ? undefined : 'span 2'} coreCalculationsId={coreCalculationsId} />
      <FootprintComparisonChartCard coreCalculationsId={coreCalculationsId} />
      <CostComparisonChartCard coreCalculationsId={coreCalculationsId} />
    </Grid>
  );
}
