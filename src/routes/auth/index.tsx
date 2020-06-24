import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';
import SignIn from '../../modules/User/pages/SignIn';
import SignUp from '../../modules/User/pages/SignUp';

const Auth = createStackNavigator();

const AuthRoutes: React.FC = () => {
  return (
    <Auth.Navigator initialRouteName="SignIn">
      <Auth.Screen name="SignIn" component={SignIn} />
      <Auth.Screen name="SignUp" component={SignUp} />
    </Auth.Navigator>
  );
};

export default AuthRoutes;
