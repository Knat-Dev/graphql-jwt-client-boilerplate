import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  createHttpLink,
  DocumentNode,
  InMemoryCache,
  split,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { TokenRefreshLink } from 'apollo-link-token-refresh';
import jwtDecode from 'jwt-decode';
import React, { FC, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { AuthContextProvider, useAuthContext } from './context';
import './index.css';
import reportWebVitals from './reportWebVitals';
import Router from './Router';
import { getAccessToken, setAccessToken } from './utils';

const httpLink = createHttpLink({
  uri: process.env.REACT_APP_API + '/graphql',
  credentials: 'include',
});

const authLink = setContext((_, { headers }) => {
  const token = getAccessToken();
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const tokenRefreshLink = new TokenRefreshLink({
  accessTokenField: 'accessToken',
  isTokenValidOrUndefined: () => {
    const token = getAccessToken();
    if (!token) return true;

    try {
      const { exp } = jwtDecode(token) as { exp: number };
      if (Date.now() >= exp * 1000) return false;
      else return true;
    } catch (e) {
      return false;
    }
  },
  fetchAccessToken: async (): Promise<Response> => {
    return fetch(`${process.env.REACT_APP_REFRESH_URL}`, {
      credentials: 'include',
      method: 'POST',
    });
  },
  handleFetch: (accessToken: string) => {
    setAccessToken(accessToken);
  },
  handleError: (err: Error) => {
    console.error(err);
  },
});

const wsLink = new WebSocketLink({
  // uri: `wss://api.knat.dev/graphql`,
  uri: `${process.env.REACT_APP_WS}`,
  options: {
    lazy: true,
    reconnect: true,
    reconnectionAttempts: 10,
    connectionParams: {
      token: getAccessToken(),
    },
  },
});

const isSubscriptionOperation = ({ query }: { query: DocumentNode }) => {
  const definition = getMainDefinition(query);
  return (
    definition.kind === 'OperationDefinition' &&
    definition.operation === 'subscription'
  );
};

const requestLink = split(isSubscriptionOperation, wsLink, httpLink);

const client = new ApolloClient({
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {},
      },
    },
  }),
  link: ApolloLink.from([tokenRefreshLink, authLink, requestLink]),
});

const App: FC = () => {
  const [loading, setLoading] = useState(true);
  const [, setAuthState] = useAuthContext();

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API}/refresh`, {
      credentials: 'include',
      method: 'POST',
    })
      .then(async (res) => {
        const data = await res.json();
        const { accessToken } = data;
        setAccessToken(accessToken);
        if (accessToken) {
          setAuthState({ loggedIn: true });
        }
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [setAuthState]);

  if (loading) return null;
  return (
    <ApolloProvider client={client}>
      <Router />
    </ApolloProvider>
  );
};

ReactDOM.render(
  <AuthContextProvider>
    <App />
  </AuthContextProvider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
