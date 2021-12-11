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
        src="https://cdn-icons.flaticon.com/png/512/2220/premium/2220091.png?token=exp=1639256398~hmac=e71c8013fdc83ee83827f8c993855508"
        fallbackSrc="https://cdn-icons.flaticon.com/png/512/2713/premium/2713505.png?token=exp=1639247672~hmac=675f058329f564ca37d898ace8e065dd"
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
