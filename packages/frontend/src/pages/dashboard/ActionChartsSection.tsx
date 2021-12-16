import { useContext } from 'react';
import { ActionPanelContext } from './action-panel/actionPanelContext';
import HeatingChartsSection from './heating/HeatingChartSection';
import IlluminationChartsSection from './illumination/IlluminationChartSection';
import ElectricityChartsSection from './electricity/ElectricityChartSection';

const chartSections = {
  electricity: ElectricityChartsSection,
  illumination: IlluminationChartsSection,
  heating: HeatingChartsSection,
};

export interface ActionChartsSectionProps {
  isNarrow: boolean;
}

export default function ActionChartsSection({ isNarrow }: ActionChartsSectionProps) {
  const { selectedActionCategory } = useContext(ActionPanelContext);
  const ChartSection = chartSections[selectedActionCategory?.id ?? ''];

  if (!ChartSection) {
    return null;
  }

  return <ChartSection isNarrow={isNarrow} />;
}
