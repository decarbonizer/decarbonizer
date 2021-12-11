import { Box, VStack, Heading, Spacer, Center } from '@chakra-ui/react';
import Card from '../../components/Card';

export interface NetZeroCardProps {
  startCarbonFootprint: number;
  reducedValue: number;
}

export default function NetZeroCard({ startCarbonFootprint, reducedValue }: NetZeroCardProps) {
  const achievedGoal = Math.round(reducedValue / (startCarbonFootprint / 100));
  return (
    <Card w="80" h="60">
      <VStack flexDir="column" p="4" spacing={7}>
        <Heading as="h4" size="sm" fontWeight="semibold" color="gray">
          Achieved goal by
        </Heading>
        <Spacer />
        <Box>
          <Center>
            <Heading as="h1" size="3xl" fontWeight="bold" color="green">
              {achievedGoal} %
            </Heading>
          </Center>
        </Box>
      </VStack>
    </Card>
  );
}
