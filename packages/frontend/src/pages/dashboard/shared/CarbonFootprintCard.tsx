import { Box, VStack, Heading, Spacer, Center } from '@chakra-ui/react';
import Card from '../../../components/Card';

interface CarbonFootprintCardProps {
  heading: string;
  carbonFootprint: number;
}

export default function CarbonFootprintCard({ heading, carbonFootprint }: CarbonFootprintCardProps) {
  const unitSymbol = carbonFootprint >= 1000 ? 't' : 'kg';
  const adjustedFootprint = carbonFootprint >= 1000 ? carbonFootprint / 1000 : carbonFootprint;

  return (
    <Card w="100" h="60">
      <VStack p="4" spacing={7}>
        <Heading as="h4" size="sm" fontWeight="semibold" color="gray">
          {heading}
        </Heading>
        <Spacer />
        <Box>
          <Center>
            <Heading as="h1" size="3xl" fontWeight="bold" color="green">
              {adjustedFootprint.toFixed(1)} {unitSymbol}
            </Heading>
          </Center>
        </Box>
      </VStack>
    </Card>
  );
}
