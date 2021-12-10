import { GrTarget } from 'react-icons/gr';
import HaloIcon from '../../../components/HaloIcon';
import DashboardCard from '../components/DashboardCard';
import IconQuickInfo from '../components/HaloIconQuickInfo';

export default function NetZeroCard() {
  return (
    <DashboardCard header="Goal achieved by">
      <IconQuickInfo icon={<HaloIcon icon={GrTarget} />}>38%</IconQuickInfo>
    </DashboardCard>
  );
}
