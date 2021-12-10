import { GrTarget } from 'react-icons/gr';
import HaloIcon from '../../../components/HaloIcon';
import DashboardCard from '../components/DashboardCard';
import QuickInfo from '../components/QuickInfo';
import QuickInfoLabelDescription from '../components/QuickInfoLabelDescription';

export default function NetZeroCard() {
  return (
    <DashboardCard header="Goal achieved by">
      <QuickInfo icon={<HaloIcon icon={GrTarget} />}>
        <QuickInfoLabelDescription label="38%" />
      </QuickInfo>
    </DashboardCard>
  );
}
