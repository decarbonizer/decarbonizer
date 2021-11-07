import { Input, Button, Heading, Divider, VStack, Box } from '@chakra-ui/react';

export default function LoginBox() {
  return (
    <Box w="100%">
      <Heading as="h1" size="lg" mb="4">
        Login
      </Heading>
      <VStack>
        <Input placeholder="Your E-Mail Address" />
        <Input placeholder="Your Password" />
        <Button w="100%" colorScheme="primary" type="submit">
          Login
        </Button>
      </VStack>
      <Divider my="6" />
      <Heading as="h1" size="md" mb="4">
        New here?
      </Heading>
      <Button w="100%" colorScheme="gray">
        Create an account
      </Button>
    </Box>
  );
}
