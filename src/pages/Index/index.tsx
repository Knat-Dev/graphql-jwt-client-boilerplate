import { Button, Flex, Text } from '@chakra-ui/react';
import React from 'react';
import { useAuthContext } from '../../context';
import { useLogoutMutation } from '../../graphql/generated';

export const Index = () => {
  const [logout, { loading }] = useLogoutMutation();
  const [, setAuthState] = useAuthContext();
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
