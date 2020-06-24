import 'react-native-gesture-handler';

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import AuthRoutes from './routes/auth';

const App: React.FC = () => (
  <NavigationContainer>
    <AuthRoutes />
  </NavigationContainer>
);

export default App;
