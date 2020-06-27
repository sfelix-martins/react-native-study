import 'react-native-gesture-handler';

import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';

import { NavigationContainer } from '@react-navigation/native';

import ApolloProvider from './config/apollo';
import { AuthProvider } from './contexts/auth';
import ToastProvider from './contexts/toast';
import Routes from './routes';
import theme from './config/theme';
import GlobalLoaderProvider from './contexts/global-loader';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const App: React.FC = () => {
  return (
    <PaperProvider theme={theme}>
      <SafeAreaProvider>
        <NavigationContainer theme={theme}>
          <GlobalLoaderProvider>
            <ToastProvider>
              <ApolloProvider>
                <AuthProvider>
                  <Routes />
                </AuthProvider>
              </ApolloProvider>
            </ToastProvider>
          </GlobalLoaderProvider>
        </NavigationContainer>
      </SafeAreaProvider>
    </PaperProvider>
  );
};

export default App;
