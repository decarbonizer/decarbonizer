import { Box, VStack, Heading, Center } from '@chakra-ui/layout';
import { CartesianGrid, XAxis, YAxis, Tooltip, Area, AreaChart, Legend } from 'recharts';
import { ComparisonOfCalculations } from '../../../api/surveyAnswer';
import Card from '../../../components/Card';

interface ComparisonOfCostsAndFootprintsProps {
  data: ComparisonOfCalculations[];
}

export default function ComparisonOfCostsAndFootprints({ data }: ComparisonOfCostsAndFootprintsProps) {
  return (
    <Card>
      <VStack flexDir="column" p="4" spacing={7}>
        <Heading as="h4" size="sm" fontWeight="semibold" color="grey">
          Compared bulb costs nad footprints over years
        </Heading>
        <Box>
          <Center>
            <AreaChart
              width={500}
              height={400}
              data={data}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 15,
              }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" label={{ value: 'years', position: 'insideBottomRight', offset: -30 }} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="oldCosts" stackId="1" stroke="#8884d8" fill="#8884d8" label="old costs" />
              <Area type="monotone" dataKey="newCosts" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
              <Area type="monotone" dataKey="newFootprint" stackId="1" stroke="#ffc658" fill="#ffc658" />
              <Area type="monotone" dataKey="oldFootprint" stackId="1" stroke="#7ab356" fill="#7ab356" />
            </AreaChart>
          </Center>
        </Box>
      </VStack>
    </Card>
  );
}
