import { Box, VStack, Heading, Spacer, Center } from '@chakra-ui/react';
import Card from '../../components/Card';

interface CarbonFootprintCardProps {
  carbonFootprintValue: string;
  unitSymbol: string;
}

export default function CarbonFootprintCard({ carbonFootprintValue, unitSymbol }: CarbonFootprintCardProps) {
  return (
    <Card w="80" h="60">
      <VStack p="4" spacing={7}>
        <Heading as="h4" size="sm" fontWeight="semibold" color="gray">
          Calculated footprint
        </Heading>
        <Spacer />
        <Box>
          <Center>
            <Heading as="h1" size="3xl" fontWeight="bold" color="green">
              {carbonFootprintValue} {unitSymbol}
            </Heading>
          </Center>
        </Box>
      </VStack>
    </Card>
  );
}
