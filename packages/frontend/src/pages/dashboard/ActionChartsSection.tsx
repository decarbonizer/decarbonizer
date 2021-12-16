import { useContext } from 'react';
import { DashboardContext } from './dashboardContext';
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
  const { selectedActionCategory } = useContext(DashboardContext);
  const ChartSection = chartSections[selectedActionCategory?.id ?? ''];

  if (!ChartSection) {
    return null;
  }

  return <ChartSection isNarrow={isNarrow} />;
}
