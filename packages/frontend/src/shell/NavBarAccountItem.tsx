import { Avatar, Button, HStack, Text, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { useHistory } from 'react-router';
import { routes } from '../routes';
import { loggedOut } from '../store/auth';
import { useAppDispatch } from '../store/store';

export default function NavBarAccountItem() {
  const logout = useLogout();

  return (
    <Menu>
      <MenuButton as={Button} variant="ghost">
        <HStack>
          <Avatar size="xs" />
          <Text>Account</Text>
        </HStack>
      </MenuButton>
      <MenuList>
        <MenuItem onClick={logout}>Logout</MenuItem>
      </MenuList>
    </Menu>
  );
}

function useLogout() {
  const dispatch = useAppDispatch();
  const history = useHistory();

  return () => {
    dispatch(loggedOut());
    history.push(routes.root());
  };
}
