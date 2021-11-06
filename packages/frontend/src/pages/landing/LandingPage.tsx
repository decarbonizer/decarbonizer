import { Flex, Heading, Stack, Box } from '@chakra-ui/react';
import LoginBox from './LoginBox';

export default function LandingPage() {
  return (
    <Flex minH="100%" display="flex" flexDirection="column">
      <Flex mt="10%" justify="space-between" align="center" direction="row" wrap="nowrap" px="10%">
        <Stack w="60%">
          <Heading as="h1" size="4xl">
            Decarbonizer
          </Heading>
          <Heading as="h2" size="2xl">
            Subtitle
          </Heading>
          <Heading as="h3" size="md" mt="8" color="primary" opacity="0.8" fontWeight="normal" lineHeight={1.5}>
            Information
          </Heading>
        </Stack>
        <Box>
          <LoginBox />
        </Box>
      </Flex>
    </Flex>
  );
}
