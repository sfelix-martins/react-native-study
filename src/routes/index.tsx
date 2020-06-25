import React, { useContext } from 'react';

import AuthContext from '../contexts/auth';
import AppRoutes from './app.routes';
import AuthRoutes from './auth.routes';
import { View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

const Routes: React.FC = () => {
  const { signed, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator accessibilityStates animating={true} />
      </View>
    );
  }

  return signed ? <AppRoutes /> : <AuthRoutes />;
};

export default Routes;
