import { Box, Heading, Image, Text, VStack } from '@chakra-ui/react';

export interface CarbonTreeCardProps {
  carbonFootprint: number;
}

export default function CarbonTreeCard({ carbonFootprint }: CarbonTreeCardProps) {
  const treeSequestrationPerYear = 21;
  const treeSequestrationPerMonth = 1.75;
  const calculatedTreeSequestrationPerYear = Math.round(carbonFootprint / treeSequestrationPerYear);
  const calculatedTreeSequestrationPerMonth = (carbonFootprint / treeSequestrationPerMonth).toFixed(2);
  const displayTreeSequestrationYear = `${calculatedTreeSequestrationPerYear} Tree-years`;
  const displayTreeSequestrationMonth = `${calculatedTreeSequestrationPerMonth} Tree-months`;
  return (
    <Box>
      <VStack>
        <Image
          boxSize="100px"
          src="https://cdn-icons-png.flaticon.com/512/490/490091.png"
          // src="https://image.freepik.com/free-vector/tree_1308-36471.jpg"
          alt="Tree Image"
          objectFit="cover"
          roundedTop="md"
        />
        <Heading size="sm">
          {calculatedTreeSequestrationPerYear === 0 ? displayTreeSequestrationMonth : displayTreeSequestrationYear}
        </Heading>
        <Text fontSize="sm">Carbon sequestration</Text>
      </VStack>
    </Box>
  );
}
