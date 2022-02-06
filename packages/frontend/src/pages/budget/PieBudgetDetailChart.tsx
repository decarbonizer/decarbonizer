import { Box, Heading, HStack, VStack, Text, Image } from '@chakra-ui/react';
import undraw_well_done_i2wr from '../../img/undraw_well_done_i2wr.svg';
import undraw_savings_re_eq4w from '../../img/undraw_savings_re_eq4w.svg';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { categories } from '../../calculations/calculations/getBudgetChartData';
import { DeltaResult } from '../../utils/deltaType';
import { DefaultTooltipContent } from 'recharts/lib/component/DefaultTooltipContent';
import { reversedPalette } from '../../utils/colorsChart';
import { round } from 'lodash-es';

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

export interface PieBudgetDetailChartProps {
  investmentCosts: Array<number>;
  originalCosts: Array<DeltaResult>;
}

export default function PieBudgetDetailChart({ investmentCosts, originalCosts }: PieBudgetDetailChartProps) {
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

  let costTotal = 0;
  let savingsTotal = 0;

  investmentCosts.map((investmentCost, index) => {
    if (investmentCost > 0) {
      costTotal += investmentCost;
    } else {
      savingsTotal += investmentCost;
    }
    if (originalCosts[index].delta > 0) {
      costTotal += originalCosts[index].delta;
    } else {
      savingsTotal += originalCosts[index].delta;
    }
  });

  investmentCosts.map((investmentCost, i) => {
    let percentCost;
    let percentSaving;
    // investmentCosts = costs
    if (investmentCost > 0) {
      // investmentcosts = costs , originalCost[i].delta = costs
      if (originalCosts[i].delta > 0) {
        percentCost = round(((investmentCosts[i] + originalCosts[i].delta) / Math.abs(costTotal)) * 100, 1);
        dataCosts.push({
          name: categories[i],
          cost: Math.round(investmentCosts[i] + originalCosts[i].delta),
          percentage: percentCost,
        });
        dataSavings.push({
          name: categories[i],
          saving: 0,
          percentage: 0,
        });
        // investmentcosts = costs , originalCost[i].delta <= 0 -->  savings
      } else {
        percentCost = round((investmentCosts[i] / Math.abs(costTotal)) * 100, 1);
        percentSaving = round((originalCosts[i].delta / Math.abs(savingsTotal)) * 100, 1);
        dataCosts.push({
          name: categories[i],
          cost: Math.round(investmentCosts[i]),
          percentage: percentCost,
        });
        dataSavings.push({
          name: categories[i],
          saving: Math.round(Math.abs(originalCosts[i].delta)),
          percentage: Math.abs(percentSaving),
        });
      }

      // investmentCost <= 0 --> savings
    } else {
      // investmentcosts = savings , originalCost[i].delta <= 0 -->  savings
      if (originalCosts[i].delta <= 0) {
        percentSaving = round(((investmentCosts[i] + originalCosts[i].delta) / Math.abs(savingsTotal)) * 100, 1);
        dataCosts.push({
          name: categories[i],
          cost: 0,
          percentage: 0,
        });
        dataSavings.push({
          name: categories[i],
          saving: Math.round(Math.abs(investmentCosts[i] + originalCosts[i].delta)),
          percentage: Math.abs(percentSaving),
        });
        // investmentcosts = savings , originalCost[i].delta > 0 = Costs
      } else {
        percentCost = round((originalCosts[i].delta / Math.abs(costTotal)) * 100, 1);
        percentSaving = round((investmentCosts[i] / Math.abs(savingsTotal)) * 100, 1);
        dataCosts.push({
          name: categories[i],
          cost: Math.round(originalCosts[i].delta),
          percentage: percentCost,
        });
        dataSavings.push({
          name: categories[i],
          saving: Math.round(Math.abs(investmentCosts[i])),
          percentage: Math.abs(percentSaving),
        });
      }
    }
  });

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
                  <Cell key={`cell-${index}`} fill={reversedPalette[index % reversedPalette.length]} />
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
                  <Cell key={`cell-${index}`} fill={reversedPalette[index % reversedPalette.length]} />
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
