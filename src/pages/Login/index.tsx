import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import React, { FC } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { FormikInput } from '../../components';
import { useAuthContext } from '../../context';
import { useLoginMutation } from '../../graphql/generated';
import { setAccessToken } from '../../utils';
import { toErrorMap } from '../../utils/toErrorMap';

export const Login: FC<RouteComponentProps> = ({ history }) => {
  const [login, { loading }] = useLoginMutation();
  const [, setAuthState] = useAuthContext();

  return (
    <Flex h="100vh" justify="center" align="center">
      <Box mx={4} w={300} maxW={400} textAlign="center">
        <Text fontSize="3xl" fontWeight="hairline">
          LOGIN
        </Text>
        <Formik
          initialValues={{ email: '', password: '' }}
          onSubmit={async (values, actions) => {
            try {
              const res = await login({ variables: values });
              if (res.data?.login.errors) {
                actions.setErrors(toErrorMap(res.data.login.errors));
              } else {
                if (res.data?.login.accessToken) {
                  setAuthState({ loggedIn: true });
                  setAccessToken(res.data.login.accessToken);
                  history.push('/');
                }
              }
            } catch (e) {
              console.log(e);
            }
          }}
        >
          {({ handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <FormikInput
                name="email"
                label="USERNAME/EMAIL"
                placeholder="Enter username/email address.."
              />
              <FormikInput
                name="password"
                label="PASSWORD"
                placeholder="Enter password.."
                type="password"
              />
              <Button
                disabled={loading}
                isLoading={loading}
                mt={4}
                w="100%"
                colorScheme="purple"
                type="submit"
              >
                SIGN IN
              </Button>
              <Text mt={1} fontSize="sm">
                Don't have an account yet? click{' '}
                <Text color="purple.400" as={Link} to="/register">
                  here
                </Text>
              </Text>
            </Form>
          )}
        </Formik>
      </Box>
    </Flex>
  );
};
