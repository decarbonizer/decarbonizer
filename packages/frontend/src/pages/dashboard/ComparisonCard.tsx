import { Box, Flex, VStack, Heading, Spacer, Center } from '@chakra-ui/react';
import { ComposedChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { RealEstateFootprintCalculation } from '../../api/surveyAnswer';

interface ComparisonCardProps {
  calculations: Array<RealEstateFootprintCalculation>;
}

export default function ComparisonCard({ calculations }: ComparisonCardProps) {
  return (
    <Box
      width="100%"
      height="100%"
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
      <Flex pos="relative" flexDir="column">
        <VStack flexDir="column" p="4" spacing={7}>
          <Heading as="h4" size="sm" fontWeight="semibold" color="gray">
            Compared to other real estates
          </Heading>
          <Box>
            <Center>
              <ComposedChart
                layout="vertical"
                width={500}
                height={400}
                data={calculations}
                margin={{
                  top: 20,
                  right: 20,
                  bottom: 20,
                  left: 20,
                }}>
                <CartesianGrid stroke="#f5f5f5" />
                <XAxis type="number" />
                <YAxis dataKey="realEstateName" type="category" scale="band" />
                <Tooltip />
              
                <Bar dataKey="footprint" barSize={15} fill="green" />
              </ComposedChart>
            </Center>
          </Box>
        </VStack>
      </Flex>
    </Box>
  );
}
