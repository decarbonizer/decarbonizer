import { Input, Button, Heading, Divider, VStack, Box, FormControl, FormErrorMessage, Select } from '@chakra-ui/react';
import { useState } from 'react';
import { useGetAllCompaniesQuery, useRegisterMutation } from '../../store/api';
import { loggedIn } from '../../store/auth';
import { useAppDispatch } from '../../store/store';

export interface RegistrationBoxProps {
  goToLogin: () => void;
}

export default function RegistrationBox({ goToLogin }: RegistrationBoxProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [hasLoginError, setHasLoginError] = useState(false);
  const [register, { isLoading }] = useRegisterMutation();
  const { isLoading: isLoadingCompanies, data: companies } = useGetAllCompaniesQuery();
  const dispatch = useAppDispatch();

  const handleRegistration = async () => {
    try {
      const { access_token: token } = await register({ email, password, companyId }).unwrap();
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
          handleRegistration();
        }}>
        <Heading as="h1" size="lg" mb="4">
          Create Account
        </Heading>
        <VStack>
          <Input type="email" placeholder="Your E-Mail Address" onChange={(e) => setEmail(e.target.value)} />
          <Input type="password" placeholder="Your Password" onChange={(e) => setPassword(e.target.value)} />
          <Select placeholder="Select company" onChange={(e) => setCompanyId(e.target.value)}>
            {!isLoadingCompanies && companies ? (
              companies.map((company) => (
                <option value={company._id} key={company._id}>
                  {company.companyName}
                </option>
              ))
            ) : (
              <></>
            )}
          </Select>
          <Button
            w="100%"
            colorScheme="primary"
            type="submit"
            isLoading={isLoading}
            isDisabled={email.length === 0 || password.length === 0 || companyId.length === 0}>
            Create account
          </Button>
          <FormControl mb="3" isInvalid={hasLoginError}>
            <FormErrorMessage>An account with this email already exists.</FormErrorMessage>
          </FormControl>
        </VStack>
      </form>
      <Divider my="6" />
      <Heading as="h1" size="md" mb="4">
        Already have an account?
      </Heading>
      <Button w="100%" colorScheme="gray" onClick={goToLogin}>
        Log In
      </Button>
    </Box>
  );
}
