import { Button, Heading, VStack } from '@chakra-ui/react';
import { useHistory } from 'react-router';
import CityBoxComponent from '../../components/CityBoxComponent';
import { loggedOut } from '../../store/auth';
import { useAppDispatch } from '../../store/store';

export default function HomePage() {
  const dispatch = useAppDispatch();
  const history = useHistory();

  const cities = [
    {
      name: 'Munich',
      capacity: 545,
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      size: 6000,
    },
    { name: 'Ratingen', capacity: 322, description: 'Description 2', size: 5300 },
    { name: 'Stuttgart', capacity: 231, description: 'Description 3', size: 8000 },
    { name: 'Berlin', capacity: 586, size: 1000, description: 'Description 4' },
  ];

  const handleLogout = () => {
    dispatch(loggedOut());
    history.push('/');
  };

  return (
    <VStack>
      <Heading>Home</Heading>
      <Button onClick={handleLogout}>Logout</Button>
      <CityBoxComponent cities={cities} />
    </VStack>
  );
}
