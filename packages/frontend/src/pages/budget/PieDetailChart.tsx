import { Box, Heading, HStack, VStack, Text, Image } from '@chakra-ui/react';
import undraw_well_done_i2wr from '../../img/undraw_well_done_i2wr.svg';
import undraw_savings_re_eq4w from '../../img/undraw_savings_re_eq4w.svg';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { categories } from '../../calculations/calculations/getBudgetChartData';
import { DeltaResult } from '../../utils/deltaType';
import { DefaultTooltipContent } from 'recharts/lib/component/DefaultTooltipContent';
import { palette } from '../../utils/colorsChart';

export interface CostChartDataEntry {
  name: string;
  cost: number;
  percentage: number;
}
export interface SavingChartDataEntry {
  name: string;
  saving: number;
  percentage: number;
}

export interface PieDetailChartProps {
  investmentCosts: Array<number>;
  originalCosts: Array<DeltaResult>;
  profit: number;
}

export default function PieDetailChart({ investmentCosts, originalCosts, profit }: PieDetailChartProps) {
  const dataCosts: Array<CostChartDataEntry> = [];
  const dataSavings: Array<SavingChartDataEntry> = [];

  const CustomTooltip = ({ payload }: any) => {
    if (payload?.length) {
      const newPayload = [
        { name: payload[0].name, value: payload[0].value, unit: '€' },
        { name: 'Percentage', value: payload[0].payload.percentage, unit: '%' },
      ];

      return <DefaultTooltipContent payload={newPayload} />;
    } else {
      return null;
    }
  };

  for (let i = 0; i < investmentCosts.length; i++) {
    const cost = Math.round(investmentCosts[i] + originalCosts[i].delta);
    const percentage = Math.round(((investmentCosts[i] + originalCosts[i].delta) / Math.abs(profit)) * 100 * 100) / 100;
    if (cost < 0) {
      dataSavings.push({
        name: categories[i],
        saving: Math.abs(cost),
        percentage: percentage,
      });
      dataCosts.push({
        name: categories[i],
        cost: 0,
        percentage: percentage,
      });
    } else {
      dataSavings.push({
        name: categories[i],
        saving: 0,
        percentage: percentage,
      });
      dataCosts.push({
        name: categories[i],
        cost: Math.abs(cost),
        percentage: percentage,
      });
    }
  }
  const newDataCosts = dataCosts.filter((category) => category.cost > 0);
  const newDataSavings = dataSavings.filter((category) => category.saving > 0);

  return (
    <HStack>
      <Box w="50%" h="md">
        <Heading size="md">Costs in €</Heading>
        {newDataCosts.length ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={newDataCosts} dataKey="cost" innerRadius={80} outerRadius={130} paddingAngle={3} label>
                {newDataCosts.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={palette[index % palette.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <VStack>
            <Image src={undraw_well_done_i2wr} boxSize="250px" />
            <Text>No costs generated for this year! </Text>
          </VStack>
        )}
      </Box>
      <Box w="50%" h="md">
        <Heading size="md">Savings in €</Heading>
        {newDataSavings.length ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={newDataSavings} dataKey="saving" innerRadius={80} outerRadius={130} paddingAngle={3} label>
                {newDataSavings.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={palette[index % palette.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <VStack>
            <Image src={undraw_savings_re_eq4w} boxSize="250px" />
            <Text>No savings generated for this year. </Text>
          </VStack>
        )}
      </Box>
    </HStack>
  );
}
