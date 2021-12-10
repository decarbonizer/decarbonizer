import { Center, SimpleGrid, Text } from '@chakra-ui/layout';
import { IlluminationCalculation } from '../../../api/surveyAnswer';
import DashboardCard, { DashboardCardProps } from '../components/DashboardCard';

export interface CalculatedCostsCardProps extends DashboardCardProps {
  calculatedCosts: IlluminationCalculation;
}

export default function CalculatedCostsCard({ calculatedCosts, ...rest }: CalculatedCostsCardProps) {
  return (
    <DashboardCard header="Calculated costs" {...rest}>
      <SimpleGrid rows={4} gap={2}>
        <SimpleGrid columns={2}>
          <Center>
            <Text color="green" fontWeight="bold" fontSize="30">
              {calculatedCosts.amountOfIlluminants}
            </Text>
          </Center>
          <Text fontWeight="semibold" fontSize="13">
            {calculatedCosts.typeOfBulb} used
          </Text>
        </SimpleGrid>
        <SimpleGrid columns={2}>
          <Center>
            <Text color="green" fontWeight="bold" fontSize="30">
              {calculatedCosts.costs}€
            </Text>
          </Center>{' '}
          <Text fontWeight="semibold" fontSize="13">
            Electricity costs
          </Text>
        </SimpleGrid>
        <SimpleGrid columns={2}>
          <Center>
            <Text color="green" fontWeight="bold" fontSize="30">
              {(calculatedCosts.overallFootprint / 1000).toFixed(2)}t{' '}
            </Text>
          </Center>
          <Text fontWeight="semibold" fontSize="13">
            Carbon emmisisons through illumination
          </Text>
        </SimpleGrid>
      </SimpleGrid>
    </DashboardCard>
  );
}
