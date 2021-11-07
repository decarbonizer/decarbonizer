import { Box, Flex } from '@chakra-ui/react';
import Hero from './Hero';
import LoginForm from './LoginForm';
import bg from './bg.svg';

export default function LandingPage() {
  return (
    <Flex minH="100%" backgroundImage={bg}>
      <Box w="100%" grow={1}>
        <Hero />
      </Box>
      <Flex
        as="aside"
        direction="column"
        justify="center"
        align="center"
        pos="sticky"
        minW="md"
        p="8"
        bg="gray.50"
        border="1px"
        borderColor="gray.200"
        shadow="xl">
        <LoginForm />
      </Flex>
    </Flex>
  );
}
