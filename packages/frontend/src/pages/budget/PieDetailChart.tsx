import { PieChart } from 'recharts';
import { DeltaResult } from '../../utils/deltaType';

export interface PieDetailChartProps {
  investmentCosts: Array<number>;
  originalCosts: Array<DeltaResult>;
}

export default function PieDetailChart({ investmentCosts, originalCosts }: PieDetailChartProps) {
  return <PieChart width={800} height={400}></PieChart>;
}
