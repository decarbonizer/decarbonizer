import { Box, Flex, VStack, Heading, Spacer, Center } from "@chakra-ui/layout";

interface CarbonFootprintCardProps {
    heading: string,
    carbonFootprintValue: number,
    unitSymbol: string
}

export default function CarbonFootprintCard({heading, carbonFootprintValue, unitSymbol} : CarbonFootprintCardProps) {
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
          <Heading as="h4" size="sm" fontWeight="semibold" color="gray">
            {heading}
          </Heading>
          <Spacer/>
          <Box>
              <Center>
          <Heading as="h1" size="3xl" fontWeight="bold" color="green">
            {carbonFootprintValue.toFixed(1)} {unitSymbol}
          </Heading>
          </Center>
          </Box>
        </VStack>
      </Flex>
    </Box>
    )
}