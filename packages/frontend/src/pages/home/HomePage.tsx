import { Button, Heading, VStack } from '@chakra-ui/react';
import { useHistory } from 'react-router';
import { loggedOut } from '../../store/auth';
import { useAppDispatch } from '../../store/store';

export default function HomePage() {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const handleLogout = () => {
    dispatch(loggedOut());
    history.push('/');
  };

  return (
    <VStack>
      <Heading>Home</Heading>
      <Button onClick={handleLogout}>Logout</Button>
    </VStack>
  );
}
