import { Button, Flex, Text } from '@chakra-ui/react';
import React, { useCallback, useEffect } from 'react';
import { useAuthContext, useSocketContext } from '../../context';
import { useLogoutMutation } from '../../graphql/generated';

export const Index = () => {
  const [logout, { loading }] = useLogoutMutation();
  const [, setAuthState] = useAuthContext();
  const [socket] = useSocketContext();

  // Handle page refresh while connected to socket
  const onRefreshedPage = useCallback(() => {
    if (socket) {
      socket.emit('refresh_page');
      socket.disconnect();
    }
  }, [socket]);
  useEffect(() => {
    window.addEventListener('beforeunload', onRefreshedPage);
    return () => {
      window.removeEventListener('beforeunload', onRefreshedPage);
    };
  }, [onRefreshedPage]);

  useEffect(() => {
    socket?.on('welcome', (msg: string) => console.log(msg));
  }, [socket]);

  return (
    <Flex
      h="48px"
      background="purple.500"
      justify="space-between"
      align="center"
      px={2}
      color="white"
    >
      <Text fontSize="xl">App Name</Text>
      <Button
        size="sm"
        disabled={loading}
        isLoading={loading}
        variant="outline"
        _hover={{ backgroundColor: 'white', color: 'purple.500' }}
        onClick={async () => {
          try {
            await logout();
            setAuthState({ loggedIn: false });
          } catch (e) {
            console.log(e);
          }
        }}
      >
        LOGOUT
      </Button>
    </Flex>
  );
};
