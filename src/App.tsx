import 'react-native-gesture-handler';

import React from 'react';
import { StatusBar } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';

import ApolloProvider from './apollo';
import { NavigationContainer } from '@react-navigation/native';

import { AuthProvider } from './contexts/auth';
import Routes from './routes';
import theme from './theme';

const App: React.FC = () => (
  <PaperProvider theme={theme}>
    <NavigationContainer theme={theme}>
      <ApolloProvider>
        <AuthProvider>
          <StatusBar barStyle="light-content" />
          <Routes />
        </AuthProvider>
      </ApolloProvider>
    </NavigationContainer>
  </PaperProvider>
);

export default App;
