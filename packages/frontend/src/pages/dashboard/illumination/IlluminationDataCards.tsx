import { Box, Flex, VStack, Heading, Center, Text } from '@chakra-ui/layout';
import { SimpleGrid } from '@chakra-ui/react';
import { IlluminationCalculation } from '../../../api/surveyAnswer';

interface IlluminationDataCardsProps {
  illuminationData: Array<IlluminationCalculation>;
}

export default function IlluminationDataCards({ illuminationData }: IlluminationDataCardsProps) {
  return (
    <SimpleGrid columns={illuminationData.length} gap={6}>
      {illuminationData.map((data, index) => (
        <Box
          key={index}
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
              <Heading as="h4" size="sm" fontWeight="bold">
                {data.typeOfBulb} information
              </Heading>
              <Box>
                <Center>
                  <SimpleGrid rows={4} gap={2}>
                    <SimpleGrid columns={2}>
                      <Text fontWeight="semibold">Amount of illuminants:</Text>
                      <Center>
                        <Text color="green">{data.amountOfIlluminants} </Text>
                      </Center>
                    </SimpleGrid>
                    <SimpleGrid columns={2}>
                      <Text fontWeight="semibold">Power Consumption:</Text>
                      <Center>
                        <Text color="green">{data.powerConsumption} kW </Text>
                      </Center>
                    </SimpleGrid>
                    <SimpleGrid columns={2}>
                      <Text fontWeight="semibold">Costs:</Text>
                      <Center>
                        <Text color="green">{data.costs} Euro</Text>
                      </Center>
                    </SimpleGrid>
                    <SimpleGrid columns={2}>
                      <Text fontWeight="semibold">Overall footprint:</Text>
                      <Center>
                        <Text color="green">{data.overallFootprint} kg </Text>
                      </Center>
                    </SimpleGrid>
                  </SimpleGrid>
                </Center>
              </Box>
            </VStack>
          </Flex>
        </Box>
      ))}
    </SimpleGrid>
  );
}
