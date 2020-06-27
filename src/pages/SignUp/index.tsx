import React from 'react';
import { View, StatusBar } from 'react-native';
import { Appbar } from 'react-native-paper';
import { useNavigation, useTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import StepOne from './StepOne';
import StepTwo from './StepTwo';

const SignUpStepsStack = createStackNavigator();

const SignUp: React.FC = () => {
  return (
    <SignUpStepsStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="StepOne">
      <SignUpStepsStack.Screen name="StepOne" component={StepOne} />
      <SignUpStepsStack.Screen name="StepTwo" component={StepTwo} />
    </SignUpStepsStack.Navigator>
  );
};

export default SignUp;
