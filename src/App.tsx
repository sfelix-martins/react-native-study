import 'react-native-gesture-handler';

import React from 'react';
import { StatusBar } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';

import { NavigationContainer } from '@react-navigation/native';

import ApolloProvider from './config/apollo';
import { AuthProvider } from './contexts/auth';
import ToastProvider from './contexts/toast';
import Routes from './routes';
import theme from './config/theme';

const App: React.FC = () => (
  <PaperProvider theme={theme}>
    <NavigationContainer theme={theme}>
      <ToastProvider>
        <ApolloProvider>
          <AuthProvider>
            <StatusBar barStyle="light-content" />
            <Routes />
          </AuthProvider>
        </ApolloProvider>
      </ToastProvider>
    </NavigationContainer>
  </PaperProvider>
);

export default App;
