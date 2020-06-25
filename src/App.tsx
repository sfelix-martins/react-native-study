import 'react-native-gesture-handler';

import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';

import AuthRoutes from './routes/auth';
import theme from './theme';
import { StatusBar } from 'react-native';

const App: React.FC = () => (
  <PaperProvider theme={theme}>
    <NavigationContainer theme={theme}>
      <StatusBar barStyle="light-content" />
      <AuthRoutes />
    </NavigationContainer>
  </PaperProvider>
);

export default App;
