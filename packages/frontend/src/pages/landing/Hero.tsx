import { Stack, Heading, Image, Box } from '@chakra-ui/react';
import mainImage from './main-image.svg';

export default function Hero() {
  return (
    <Box pos="relative" p="7% 7% 0 7%" h="100%">
      <Stack>
        <Heading as="h1" size="4xl">
          Decarbonizer
        </Heading>
        <Heading as="h2" size="lg" color="gray.600">
          Helping you make your company carbon neutral by 2050.
        </Heading>
      </Stack>
      <Image pos="absolute" bottom="0" height="50%" src={mainImage} alt="Hero Image" />
    </Box>
  );
}
