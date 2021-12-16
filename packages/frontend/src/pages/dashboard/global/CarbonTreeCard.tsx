import { Heading, Image, Text, VStack } from '@chakra-ui/react';
import tree from './tree.png';
export interface CarbonTreeCardProps {
  carbonFootprint: number;
}

export default function CarbonTreeCard({ carbonFootprint }: CarbonTreeCardProps) {
  const treeSequestrationPerYear = 21;
  const treeSequestrationPerMonth = treeSequestrationPerYear / 12;
  const calculatedTreeSequestrationPerYear = Math.round(carbonFootprint / treeSequestrationPerYear);
  const calculatedTreeSequestrationPerMonth = (carbonFootprint / treeSequestrationPerMonth).toFixed(2);
  const displayTreeSequestrationYear = `${calculatedTreeSequestrationPerYear} Tree-years`;
  const displayTreeSequestrationMonth = `${calculatedTreeSequestrationPerMonth} Tree-months`;

  return (
    <VStack>
      <Image boxSize="100px" src={tree} alt="Tree Image" objectFit="cover" roundedTop="md" />
      <Heading size="sm">
        {calculatedTreeSequestrationPerYear === 0 ? displayTreeSequestrationMonth : displayTreeSequestrationYear}
      </Heading>
      <Text fontSize="sm">Carbon sequestration</Text>
    </VStack>
  );
}
