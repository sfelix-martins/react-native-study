import React from 'react';
import ApolloClient from 'apollo-boost';

import { ApolloProvider } from '@apollo/react-hooks';
import AsyncStorage from '@react-native-community/async-storage';

const client = new ApolloClient({
  uri: 'http://localhost:3000/graphql',
  request: async (operation) => {
    let token = await AsyncStorage.getItem('@Levare:token');

    operation.setContext({
      headers: {
        authorization: token ? `Bearer ${token}` : '',
      },
      // The context from operation override this context if needed
      ...operation.getContext(),
    });
  },
});

const Apollo: React.FC = ({ children }) => (
  <ApolloProvider client={client}>{children}</ApolloProvider>
);

export default Apollo;
