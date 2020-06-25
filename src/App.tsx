import 'react-native-gesture-handler';

import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './contexts/auth';

import Routes from './routes';
import theme from './theme';
import { StatusBar } from 'react-native';

const App: React.FC = () => (
  <PaperProvider theme={theme}>
    <NavigationContainer theme={theme}>
      <AuthProvider>
        <StatusBar barStyle="light-content" />
        <Routes />
      </AuthProvider>
    </NavigationContainer>
  </PaperProvider>
);

export default App;
