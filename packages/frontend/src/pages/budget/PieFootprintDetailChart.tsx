import { Box, Heading, HStack, VStack, Text, Image } from '@chakra-ui/react';
import undraw_well_done_i2wr from '../../img/undraw_well_done_i2wr.svg';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { categories } from '../../calculations/calculations/getBudgetChartData';
import { DeltaResult } from '../../utils/deltaType';
import { DefaultTooltipContent } from 'recharts/lib/component/DefaultTooltipContent';
import { palette } from '../../utils/colorsChart';

export interface FootprintSavingsChartDataEntry {
  name: string;
  footprint: number;
  percentage: number;
}

export interface PieFootprintDetailChartProps {
  categoriesFootprint: Array<DeltaResult>;
  originalFootprint: number;
}

export default function PieFootprintDetailChart({
  categoriesFootprint,
  originalFootprint,
}: PieFootprintDetailChartProps) {
  const dataFootprint: Array<FootprintSavingsChartDataEntry> = [];

  const CustomTooltip = ({ payload }: any) => {
    if (payload?.length) {
      const newPayload = [
        { name: payload[0].name, value: payload[0].value, unit: 'kg' },
        { name: 'Percentage', value: payload[0].payload.percentage, unit: '%' },
      ];

      return <DefaultTooltipContent payload={newPayload} />;
    } else {
      return null;
    }
  };
  categoriesFootprint.map((category, index) => {
    const percentage = Math.round((category.delta / Math.abs(originalFootprint)) * 100 * 100) / 100;
    dataFootprint.push({
      name: categories[index],
      footprint: Math.round(category.delta),
      percentage: percentage,
    });
  });

  return (
    <HStack>
      <Box w="50%" h="md">
        <Heading size="md">Costs in €</Heading>
        {dataFootprint.length ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={dataFootprint} dataKey="footprint" innerRadius={80} outerRadius={130} paddingAngle={3} label>
                {dataFootprint.map((entry, index) => (
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
    </HStack>
  );
}
