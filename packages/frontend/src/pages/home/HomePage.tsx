import { Button, Heading, VStack } from '@chakra-ui/react';
import { useHistory } from 'react-router';
import CityBoxComponent from '../../components/city-box/CityBoxComponent';
import { routes } from '../../constants';
import { loggedOut } from '../../store/auth';
import { useAppDispatch } from '../../store/store';

export default function HomePage() {
  const dispatch = useAppDispatch();
  const history = useHistory();

  const handleLogout = () => {
    dispatch(loggedOut());
    history.push(routes.root);
  };

  return (
    <VStack>
      <Heading>Home</Heading>
      <Button onClick={handleLogout}>Logout</Button>
      <CityBoxComponent />
    </VStack>
  );
}
