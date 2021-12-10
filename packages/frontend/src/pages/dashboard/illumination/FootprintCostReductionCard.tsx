import { SimpleGrid } from '@chakra-ui/layout';
import { Box, Center, Heading, Icon } from '@chakra-ui/react';
import { PieChart, Pie, Cell } from 'recharts';
import { Calculation } from '../../../api/surveyAnswer';
import { FcMoneyTransfer } from 'react-icons/fc';
import { IoWarning } from 'react-icons/io5';
import DashboardCard, { DashboardCardProps } from '../components/DashboardCard';

export interface FootprintCostReductionCardProps extends DashboardCardProps {
  oldCalculation: Calculation;
  newCalculation: Calculation;
}

export default function FootprintCostReductionCard({
  oldCalculation,
  newCalculation,
  ...rest
}: FootprintCostReductionCardProps) {
  const footprintDifference = oldCalculation.footprint - newCalculation.footprint;
  const costsDifference = oldCalculation.costs - newCalculation.costs;
  const data = [oldCalculation, { footprint: footprintDifference, costs: costsDifference }];

  return (
    <DashboardCard header="Reduced emissions and costs" {...rest}>
      <SimpleGrid columns={2} gap={2}>
        {footprintDifference < 0 ? (
          <SimpleGrid rows={2}>
            <Box width={150} height={200} position="relative" paddingLeft="5">
              <Center>
                <Icon as={IoWarning} boxSize="110" position="absolute" top="50" color="#ffd700" />
              </Center>
            </Box>
            <SimpleGrid rows={2}>
              <Center>
                <Heading size="sm">Increased footprint</Heading>
              </Center>
              <Center>{Math.abs(footprintDifference).toFixed(2)} kg</Center>
            </SimpleGrid>
          </SimpleGrid>
        ) : (
          <SimpleGrid rows={2}>
            <Center paddingLeft="4">
              <PieChart width={150} height={200}>
                <Pie
                  data={data}
                  cx={60}
                  cy={100}
                  innerRadius={35}
                  outerRadius={60}
                  fill="#8884d8"
                  paddingAngle={1}
                  dataKey="footprint">
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index == 0 ? 'gray' : 'green'} />
                  ))}
                </Pie>
                <text x={60} y={100} dy={11} dx={6} textAnchor="middle">
                  CO2
                </text>
              </PieChart>
            </Center>
            <SimpleGrid rows={2}>
              <Center>
                <Heading size="sm">Reduced by </Heading>
              </Center>
              <Center>{footprintDifference.toFixed(2)} kg</Center>
            </SimpleGrid>
          </SimpleGrid>
        )}

        {costsDifference < 0 ? (
          <SimpleGrid rows={2}>
            <Box width={150} height={200} position="relative" paddingLeft="5">
              <Center>
                <Icon as={FcMoneyTransfer} boxSize="110" position="absolute" top="50" />
              </Center>
            </Box>
            <SimpleGrid rows={2}>
              <Center>
                <Heading size="sm">Additional costs</Heading>
              </Center>
              <Center>{Math.abs(costsDifference)} €</Center>
            </SimpleGrid>
          </SimpleGrid>
        ) : (
          <SimpleGrid rows={2}>
            <Center paddingLeft="4">
              <PieChart width={150} height={200}>
                <Pie
                  data={data}
                  cx={60}
                  cy={100}
                  innerRadius={35}
                  outerRadius={60}
                  fill="#8884d8"
                  paddingAngle={1}
                  dataKey="costs">
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index == 0 ? 'gray' : 'green'} />
                  ))}
                </Pie>
                <text x={60} y={100} dy={11} dx={6} textAnchor="middle">
                  CO2
                </text>
              </PieChart>
            </Center>
            <SimpleGrid rows={2}>
              <Center>
                <Heading size="sm">Savings</Heading>
              </Center>
              <Center>{costsDifference.toFixed(2)} €</Center>
            </SimpleGrid>
          </SimpleGrid>
        )}
      </SimpleGrid>
    </DashboardCard>
  );
}
