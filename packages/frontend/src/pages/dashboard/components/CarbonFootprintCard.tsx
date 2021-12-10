import { GiFootprint } from 'react-icons/gi';
import HaloIcon from '../../../components/HaloIcon';
import DashboardCard, { DashboardCardProps } from './DashboardCard';
import IconQuickInfo from './HaloIconQuickInfo';

interface CarbonFootprintCardProps extends DashboardCardProps {
  carbonFootprint: number;
}

export default function CarbonFootprintCard({ carbonFootprint, ...rest }: CarbonFootprintCardProps) {
  const unitSymbol = carbonFootprint >= 1000 ? 't' : 'kg';
  const adjustedFootprint = carbonFootprint >= 1000 ? carbonFootprint / 1000 : carbonFootprint;

  return (
    <DashboardCard
      header={
        <>
          CO<sub>2</sub> footprint
        </>
      }
      {...rest}>
      <IconQuickInfo icon={<HaloIcon icon={GiFootprint} />}>
        {adjustedFootprint.toFixed(1)}
        {unitSymbol}
      </IconQuickInfo>
    </DashboardCard>
  );
}
