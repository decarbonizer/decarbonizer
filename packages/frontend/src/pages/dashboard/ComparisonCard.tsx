import { VStack, Heading, Center } from '@chakra-ui/react';
import { ComposedChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { RealEstateFootprintCalculation } from '../../api/surveyAnswer';
import Card from '../../components/Card';

interface ComparisonCardProps {
  calculations: Array<RealEstateFootprintCalculation>;
}

export default function ComparisonCard({ calculations }: ComparisonCardProps) {
  return (
    <Card w="100%" h="100%">
      <VStack flexDir="column" p="4" spacing={7}>
        <Heading as="h4" size="sm" fontWeight="semibold" color="gray">
          Compared to other real estates
        </Heading>
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
      </VStack>
    </Card>
  );
}
