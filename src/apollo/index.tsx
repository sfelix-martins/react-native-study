import { NormalizedCacheObject } from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-boost';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';

import { ApolloProvider } from '@apollo/react-hooks';
import AsyncStorage from '@react-native-community/async-storage';

function makeApolloClient(token: string): ApolloClient<NormalizedCacheObject> {
  return new ApolloClient({
    uri: 'http://localhost:3000/graphql',
    request: (operation) => {
      operation.setContext({
        headers: {
          authorization: token ? `Bearer ${token}` : '',
        },
      });
    },
  });
}

const Apollo: React.FC = ({ children }) => {
  const [client, setClient] = useState<ApolloClient<any> | null>(null);

  useEffect(() => {
    async function fetchToken() {
      const token = await AsyncStorage.getItem('@Levare:token');

      setClient(makeApolloClient(token ?? ''));
    }

    fetchToken();
  }, []);

  if (!client) {
    return <View />;
  }

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default Apollo;
