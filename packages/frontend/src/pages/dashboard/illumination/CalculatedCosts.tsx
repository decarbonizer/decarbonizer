import { Box, Flex, VStack, Heading, Center, SimpleGrid, Text } from '@chakra-ui/layout';
import { IlluminationCalculation } from '../../../api/surveyAnswer';

interface CalculatedCostsProps {
  calculatedCosts: IlluminationCalculation;
}

export default function CalculatedCosts({ calculatedCosts }: CalculatedCostsProps) {
  return (
    <Box
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
      <Flex pos="relative" flexDir="column" w="80" h="60">
        <VStack flexDir="column" p="4" spacing={7}>
          <Heading as="h4" size="sm" fontWeight="semibold" color="grey">
            Calculated costs
          </Heading>
          <Box>
            <Center>
              <SimpleGrid rows={4} gap={2}>
                <SimpleGrid columns={2}>
                  <Center>
                    <Text color="green" fontWeight="bold" fontSize="30">
                      {calculatedCosts.amountOfIlluminants}
                    </Text>
                  </Center>
                  <Text fontWeight="semibold" fontSize="13">{calculatedCosts.typeOfBulb} used</Text>
                </SimpleGrid>
                <SimpleGrid columns={2}>
                  <Center>
                    <Text color="green" fontWeight="bold" fontSize="30">
                      {calculatedCosts.costs}€
                    </Text>
                  </Center>{' '}
                  <Text fontWeight="semibold" fontSize="13">Electricity costs</Text>
                </SimpleGrid>
                <SimpleGrid columns={2}>
                  <Center>
                    <Text color="green" fontWeight="bold" fontSize="30">
                      {(calculatedCosts.overallFootprint/1000).toFixed(2)}t{' '}
                    </Text>
                   
                  </Center>
                  <Text fontWeight="semibold" fontSize="13">Carbon emmisisons through illumination</Text>
                </SimpleGrid>
              </SimpleGrid>
            </Center>
          </Box>
        </VStack>
      </Flex>
    </Box>
  );
}
