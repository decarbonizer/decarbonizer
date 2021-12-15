import { useContext } from 'react';
import { ActionPanelContext } from './action-panel/actionPanelContext';
import IlluminationChartsSection from './illumination/IlluminationChartSection';
import ElectricityChartsSection from './electricity/ElectricityChartSection';

const chartSections = {
  electricity: ElectricityChartsSection,
  illumination: IlluminationChartsSection,
};

export default function ActionChartsSection() {
  const { selectedActionCategory } = useContext(ActionPanelContext);
  const ChartSection = chartSections[selectedActionCategory?.id ?? ''];

  if (!ChartSection) {
    return null;
  }

  return <ChartSection />;
}
