import { Heading, VStack } from '@chakra-ui/react';
import RealEstateBox from './RealEstateBox';

export default function HomePage() {
  return (
    <VStack>
      <Heading>Home</Heading>
      <RealEstateBox />
    </VStack>
  );
}
