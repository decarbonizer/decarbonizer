import { BiTargetLock } from 'react-icons/bi';
import HaloIcon from '../../../components/HaloIcon';
import DashboardCard from '../components/DashboardCard';
import QuickInfo from '../components/QuickInfo';
import QuickInfoLabelDescription from '../components/QuickInfoLabelDescription';
export interface NetZeroCardProps {
  startCarbonFootprint: number;
  reducedValue: number;
}

export default function NetZeroCard({ startCarbonFootprint, reducedValue }: NetZeroCardProps) {
  const achievedGoal = (reducedValue / (startCarbonFootprint / 100)).toFixed(1);
  return (
    <DashboardCard header="Goal achieved by">
      <QuickInfo icon={<HaloIcon icon={BiTargetLock} />}>
        <QuickInfoLabelDescription label={`${achievedGoal} %`} />
      </QuickInfo>
    </DashboardCard>
  );
}
