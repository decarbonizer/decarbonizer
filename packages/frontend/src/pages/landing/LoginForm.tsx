import { Input, Button, Heading, Divider, VStack, Box, FormControl, FormErrorMessage } from '@chakra-ui/react';
import { useState } from 'react';
import { useLoginMutation } from '../../store/api';
import { loggedIn } from '../../store/auth';
import { useAppDispatch } from '../../store/store';

export default function LoginBox() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hasLoginError, setHasLoginError] = useState(false);
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();

  const handleLogin = async () => {
    try {
      const { access_token: token } = await login({ email, password }).unwrap();
      dispatch(loggedIn({ token }));
    } catch (e) {
      setHasLoginError(true);
    }
  };

  return (
    <Box w="100%">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}>
        <Heading as="h1" size="lg" mb="4">
          Login
        </Heading>
        <VStack>
          <Input type="email" placeholder="Your E-Mail Address" onChange={(e) => setEmail(e.target.value)} />
          <Input type="password" placeholder="Your Password" onChange={(e) => setPassword(e.target.value)} />
          <Button
            w="100%"
            colorScheme="primary"
            type="submit"
            isLoading={isLoading}
            isDisabled={email.length === 0 || password.length === 0}>
            Login
          </Button>
          <FormControl mb="3" isInvalid={hasLoginError}>
            <FormErrorMessage>
              Unfortunately we could not log you in. Please check whether your credentials are correct.
            </FormErrorMessage>
          </FormControl>
        </VStack>
      </form>
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
