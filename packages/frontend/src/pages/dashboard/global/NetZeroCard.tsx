import { GrTarget } from 'react-icons/gr';
import IconDashboardCard from '../components/IconDashboardCard';

export default function NetZeroCard() {
  return (
    <IconDashboardCard header="Goal achieved by" icon={GrTarget}>
      38 %
    </IconDashboardCard>
  );
}
