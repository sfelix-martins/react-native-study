import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import ForgotPassword from '../pages/ForgotPassword';
import { useTheme } from '@react-navigation/native';

const AuthStack = createStackNavigator();

const AuthRoutes: React.FC = () => {
  const { colors } = useTheme();

  return (
    <AuthStack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="SignIn">
      <AuthStack.Screen
        name="SignIn"
        options={{ title: 'Login' }}
        component={SignIn}
      />
      <AuthStack.Screen
        name="SignUp"
        options={{
          title: 'Register',
          headerShown: true,
          headerBackTitleVisible: false,
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: '#fff',
        }}
        component={SignUp}
      />
      <AuthStack.Screen
        name="ForgotPassword"
        options={{
          title: 'Reset Password',
          headerShown: true,
          headerBackTitleVisible: false,
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: '#fff',
        }}
        component={ForgotPassword}
      />
    </AuthStack.Navigator>
  );
};

export default AuthRoutes;
