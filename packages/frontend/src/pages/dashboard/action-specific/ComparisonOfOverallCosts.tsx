import { VStack, Heading, Box, Center } from '@chakra-ui/layout';
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from 'recharts';
import Card from '../../../components/Card';

export default function ComparisonOfOverallCosts() {
  const data = [
    {
      legacy: 2500,
      optimized: 8000,
      amt: 2400,
    },
    {
      legacy: 3000,
      optimized: 7000,
      amt: 2210,
    },
    {
      legacy: 5000,
      optimized: 6000,
      amt: 2290,
    },
    {
      legacy: 6000,
      optimized: 5000,
      amt: 2000,
    },
    {
      legacy: 6000,
      optimized: 4500,
      amt: 2181,
    },
    {
      legacy: 7000,
      optimized: 3000,
      amt: 2500,
    },
    {
      legacy: 8000,
      optimized: 2500,
      amt: 2100,
    },
  ];

  return (
    <Card w="100" h="80">
      <VStack flexDir="column" optimized="4" spacing={7} p="4">
        <Heading as="h4" size="sm" fontWeight="semibold" color="grey">
          Legacy and optimized costs over years
        </Heading>
        <Box>
          <Center>
            <BarChart
              width={400}
              height={250}
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="optimized" fill="green" />
              <Bar dataKey="legacy" fill="#82ca9d" />
            </BarChart>
          </Center>
        </Box>
      </VStack>
    </Card>
  );
}
