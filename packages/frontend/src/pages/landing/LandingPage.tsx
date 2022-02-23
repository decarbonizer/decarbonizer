import { Box, Flex } from '@chakra-ui/react';
import Hero from './Hero';
import LoginForm from './LoginForm';
import bg from './bg.svg';
import RegistrationForm from './RegistrationForm';
import React from 'react';

export default function LandingPage() {
  const [authForm, setAuthForm] = React.useState('login');

  const goToLoginForm = () => {
    setAuthForm('login');
  };

  const goToRegistrationForm = () => {
    setAuthForm('register');
  };

  return (
    <Flex minH="100%" backgroundImage={bg}>
      <Box w="100%" flexGrow={1}>
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
        {authForm === 'login' ? (
          <LoginForm goToRegistration={goToRegistrationForm} />
        ) : (
          <RegistrationForm goToLogin={goToLoginForm} />
        )}
      </Flex>
    </Flex>
  );
}
