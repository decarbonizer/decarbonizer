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

  // TODO: This doesn't work correctly
  console.log('selectedActionCategory', selectedActionCategory);

  if (!ChartSection) {
    return null;
  }

  return <ChartSection />;
}
