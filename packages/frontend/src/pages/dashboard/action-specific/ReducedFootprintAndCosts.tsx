import { SimpleGrid } from '@chakra-ui/layout';
import { Box, Center, Flex, Heading, VStack } from '@chakra-ui/react';
import { useEffect } from 'react';
import { PieChart, Pie, Cell } from 'recharts';
import { GeneralCalculation, IlluminationCalculation } from '../../../api/surveyAnswer';

interface ReducedFootprintAndCostsProps {
    oldCalculation: GeneralCalculation;
    newIllumination: IlluminationCalculation;
}

export default function ReducedFootprintAndCosts({ oldCalculation, newIllumination } : ReducedFootprintAndCostsProps) {
    const footprintDifference = oldCalculation.overallFootprint - newIllumination.overallFootprint;
    const costsDifference = oldCalculation.costs - newIllumination.costs;
    const data = [
        newIllumination,
         {overallFootprint: footprintDifference, costs: costsDifference},
        
      ];

      useEffect(() => {
          console.log(newIllumination);
        console.log(oldCalculation);
      }, [])

    return (
        <Box
      border="1px"
      bg="white"
      borderColor="gray.100"
      rounded="md"
      shadow="lg"
      transition="all 250ms"
      _hover={{
        shadow: '2xl',
        transform: 'translateY(-0.25rem)',
      }}>
      <Flex pos="relative" flexDir="column" w="80" h="80">
        <VStack flexDir="column" p="4" spacing={7}>
          <Heading as="h4" size="sm" fontWeight="semibold" color="gray">
            Reduced emissions and costs
          </Heading>
          <Box>
            <Center>
            <SimpleGrid columns={2} gap={2}>
                <SimpleGrid rows={2}>
        <PieChart width={400} height={200}>
          <Pie
            data={data}
            cx={60}
            cy={100}
            innerRadius={35}
            outerRadius={60}
            fill="#8884d8"
            paddingAngle={1}
            dataKey="overallFootprint"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={index == 0 ?"gray" : "green"}/>
            ))}
          </Pie>
          <text x={60} y={100} dy={11} dx={6} textAnchor="middle">CO2</text>
          </PieChart>
          <Heading size="sm">Reduced by </Heading>
          {footprintDifference.toFixed(2)} kg
          </SimpleGrid>
          <SimpleGrid rows={2}>
          {costsDifference < 0 ? <Center><Heading size="sm">No savings</Heading></Center> : <><PieChart width={400} height={200}>
          <Pie
            data={data}
            cx={60}
            cy={100}
            innerRadius={35}
            outerRadius={60}
            fill="#8884d8"
            paddingAngle={1}
            dataKey="costs"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={index == 0 ?"gray" : "green"} />
            ))}
          </Pie>
          <text x={60} y={100} dy={11} dx={6} textAnchor="middle">€</text>
        </PieChart>
        <Heading size="sm">Savings </Heading>
          {costsDifference.toFixed(2)} € </>}
        </SimpleGrid>
        </SimpleGrid>
        </Center>
          </Box>
        </VStack>
      </Flex>
    </Box>
      );
}