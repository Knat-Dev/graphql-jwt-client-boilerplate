import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import React, { FC } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { FormikInput } from '../../components';
import { useRegisterMutation } from '../../graphql/generated';
import { toErrorMap } from '../../utils/toErrorMap';

export const Register: FC<RouteComponentProps> = ({ history }) => {
  const [register, { loading }] = useRegisterMutation();
  return (
    <Flex h="100vh" justify="center" align="center">
      <Box mx={4} w={300} maxW={400} textAlign="center">
        <Text fontSize="3xl" fontWeight="hairline">
          REGISTER
        </Text>
        <Formik
          initialValues={{ email: '', username: '', password: '' }}
          onSubmit={async (values, actions) => {
            try {
              const res = await register({ variables: values });
              if (res.data?.register.errors)
                actions.setErrors(toErrorMap(res.data.register.errors));
              else if (res.data?.register.ok) {
                history.push('/login');
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
                label="EMAIL"
                placeholder="Enter your email address.."
              />
              <FormikInput
                name="username"
                label="USERNAME"
                placeholder="Enter your username.."
              />
              <FormikInput
                name="password"
                label="PASSWORD"
                placeholder="Enter your password.."
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
                SIGN UP
              </Button>
              <Text mt={1} fontSize="sm">
                Already have an account? click{' '}
                <Text color="purple.400" as={Link} to="/login">
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
