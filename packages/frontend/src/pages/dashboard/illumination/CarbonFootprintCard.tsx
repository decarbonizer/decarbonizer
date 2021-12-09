import { GiFootprint } from 'react-icons/gi';
import IconDashboardCard, { IconDashboardCardProps } from '../components/IconDashboardCard';

interface CarbonFootprintCardProps extends Partial<IconDashboardCardProps> {
  carbonFootprint: number;
}

export default function CarbonFootprintCard({ carbonFootprint, ...rest }: CarbonFootprintCardProps) {
  const unitSymbol = carbonFootprint >= 1000 ? 't' : 'kg';
  const adjustedFootprint = carbonFootprint >= 1000 ? carbonFootprint / 1000 : carbonFootprint;

  return (
    <IconDashboardCard
      icon={GiFootprint}
      header={
        <>
          CO<sub>2</sub> footprint
        </>
      }
      {...rest}>
      {adjustedFootprint.toFixed(1)}
      {unitSymbol}
    </IconDashboardCard>
  );
}
