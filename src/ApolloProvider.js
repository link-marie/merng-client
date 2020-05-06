import React from 'react';
import App from './App';
import ApolloClient from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import { ApolloProvider } from '@apollo/react-hooks';
import { setContext } from 'apollo-link-context';

import { strJwtToken, strBearer } from './util/utl'

const httpLink = createHttpLink({
  // uri: 'http://localhost:5000'
  uri: 'https://desolate-harbor-56519.herokuapp.com/'
});

const authLink = setContext(() => {
  const token = localStorage.getItem(strJwtToken);
  const auth = token ? `${strBearer} ${token}` : ''
  return {
    headers: {
      Authorization: auth
    }
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

export default (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
