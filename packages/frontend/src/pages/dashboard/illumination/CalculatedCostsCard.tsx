import { Table, Tbody, Tr, Td } from '@chakra-ui/react';
import { IlluminationCalculation } from '../../../api/surveyAnswer';
import DashboardCard, { DashboardCardProps } from '../components/DashboardCard';

export interface CalculatedCostsCardProps extends DashboardCardProps {
  calculatedCosts: IlluminationCalculation;
}

export default function CalculatedCostsCard({ calculatedCosts, ...rest }: CalculatedCostsCardProps) {
  return (
    <DashboardCard header="Calculated costs" {...rest}>
      <Table variant="">
        <Tbody>
          <Tr>
            <Td fontWeight="bold" fontSize="lg" pl="0">
              {calculatedCosts.amountOfIlluminants}
            </Td>
            <Td>
              <i>{calculatedCosts.typeOfBulb}</i> used
            </Td>
          </Tr>
          <Tr>
            <Td fontWeight="bold" fontSize="lg" pl="0">
              {calculatedCosts.costs.toFixed(2)}€
            </Td>
            <Td>Electricity costs</Td>
          </Tr>
          <Tr>
            <Td fontWeight="bold" fontSize="lg" pl="0">
              {(calculatedCosts.overallFootprint / 1000).toFixed(2)}t
            </Td>
            <Td>Carbon emmisisons through illumination</Td>
          </Tr>
        </Tbody>
      </Table>
    </DashboardCard>
  );
}
