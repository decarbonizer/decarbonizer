import { useContext } from 'react';
import { ActionPanelContext } from './action-panel/actionPanelContext';

export interface GlobalChartsSectionProps {
  isNarrow: boolean;
}

export default function GlobalChartsSection({ isNarrow }: GlobalChartsSectionProps) {
  const { selectedActionCategory } = useContext(ActionPanelContext);
  const ChartSection = chartSections[selectedActionCategory?.id ?? ''];

  if (!ChartSection) {
    return null;
  }

  return <ChartSection isNarrow={isNarrow} />;
}
