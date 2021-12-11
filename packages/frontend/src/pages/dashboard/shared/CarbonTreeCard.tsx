import { Heading, Image, Text, VStack } from '@chakra-ui/react';
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
      <Image
        boxSize="100px"
        src="https://cdn-icons.flaticon.com/png/512/2220/premium/2220091.png?token=exp=1639216914~hmac=46f2d1cdb58e07c7c2133e8ddb477f8d"
        alt="Tree Image"
        objectFit="cover"
        roundedTop="md"
      />
      <Heading size="sm">
        {calculatedTreeSequestrationPerYear === 0 ? displayTreeSequestrationMonth : displayTreeSequestrationYear}
      </Heading>
      <Text fontSize="sm">Carbon sequestration</Text>
    </VStack>
  );
}
