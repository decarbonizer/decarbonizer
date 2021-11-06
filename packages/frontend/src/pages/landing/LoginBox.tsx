import { Box, Heading, Divider, VStack } from '@chakra-ui/layout';
import { Input, Button } from '@chakra-ui/react';

export default function LoginBox() {
  return (
    <Box w="md" p="4" borderRadius="lg" borderWidth="1px" boxShadow="xl">
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
        New to Decarbonizer?
      </Heading>
      <Button w="100%" colorScheme="green">
        Create an account
      </Button>
    </Box>
  );
}
