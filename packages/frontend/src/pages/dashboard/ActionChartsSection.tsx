import { useContext } from 'react';
import { ActionPanelContext } from './action-panel/actionPanelContext';
import IlluminationChartsSection from './illumination/IlluminationChartSection';

const chartSections = {
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
