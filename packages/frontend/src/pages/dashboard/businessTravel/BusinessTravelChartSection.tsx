import EmptyState from '../../../components/EmptyState';
import { ActionChartsSectionProps } from '../ActionChartsSection';
import inProgress from '../../../img/inProgress.svg';

export default function BusinessTravelChartSection({ isNarrow }: ActionChartsSectionProps) {
  return <EmptyState imgSrc={inProgress} title="Work in progress" />;
}
