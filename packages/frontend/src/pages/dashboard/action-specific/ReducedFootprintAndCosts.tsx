import { SimpleGrid } from '@chakra-ui/layout';
import { Box, Center, Heading, Icon } from '@chakra-ui/react';
import { PieChart, Pie, Cell } from 'recharts';
import { GeneralCalculation } from '../../../api/surveyAnswer';
import Card from '../../../components/Card';
import { FcMoneyTransfer } from 'react-icons/fc';

interface ReducedFootprintAndCostsProps {
  oldCalculation: GeneralCalculation;
  reduction: GeneralCalculation;
}

export default function ReducedFootprintAndCosts({ oldCalculation, reduction }: ReducedFootprintAndCostsProps) {
  const footprintDifference = oldCalculation.overallFootprint - reduction.overallFootprint;
  const costsDifference = oldCalculation.costs - reduction.costs;
  const data = [{ overallFootprint: footprintDifference, costs: costsDifference }, oldCalculation];

  return (
    <Card w="100" h="80">
      <Box p="4">
        <Center>
          <Heading as="h4" size="sm" fontWeight="semibold" color="gray">
            Reduced emissions and costs
          </Heading>
        </Center>
        <Box>
          <Center>
            <SimpleGrid columns={2} gap={2}>
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
                      dataKey="overallFootprint">
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
                  <Center>{reduction.overallFootprint.toFixed(2)} kg</Center>
                </SimpleGrid>
              </SimpleGrid>

              {reduction.costs < 0 ? (
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
                    <Center>{Math.abs(reduction.costs)} €</Center>
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
                    <Center>{reduction.costs.toFixed(2)} €</Center>
                  </SimpleGrid>
                </SimpleGrid>
              )}
            </SimpleGrid>
          </Center>
        </Box>
      </Box>
    </Card>
  );
}
