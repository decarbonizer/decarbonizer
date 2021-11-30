import { Box, VStack, Heading, Center } from '@chakra-ui/layout';
import { LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from 'recharts';
import Card from '../../../components/Card';

export default function ComparisonOfCosts() {
  const data = [
    {
      LED800: 2400,
      BULB710: 2400,
      name: 'Jan',
    },
    {
      LED800: 1398,
      BULB710: 2210,
      name: 'Mar',
    },
    {
      LED800: 9800,
      BULB710: 2290,
      name: 'May',
    },
    {
      LED800: 3908,
      BULB710: 2000,
      name: 'Jul',
    },
    {
      LED800: 4800,
      BULB710: 2181,
      name: 'Sep',
    },
    {
      LED800: 3800,
      BULB710: 2500,
      name: 'Nov',
    },
    {
      LED800: 4300,
      BULB710: 2100,
      name: 'Dec',
    },
  ];

  return (
    <Card w="100" h="80">
      <VStack flexDir="column" p="4" spacing={7}>
        <Heading as="h4" size="sm" fontWeight="semibold" color="grey">
          Compared bulb costs
        </Heading>
        <Box>
          <Center>
            <LineChart
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
              <Line type="monotone" dataKey="LED800" stroke="green" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="BULB710" stroke="#82ca9d" />
            </LineChart>
          </Center>
        </Box>
      </VStack>
    </Card>
  );
}
