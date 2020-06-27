import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import StepOne from './StepOne';
import StepTwo from './StepTwo';
import SignUpStepsProvider from '../../contexts/signup-steps';

const SignUpStepsStack = createStackNavigator();

const SignUp: React.FC = () => {
  return (
    <SignUpStepsProvider>
      <SignUpStepsStack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName="StepOne">
        <SignUpStepsStack.Screen name="StepOne" component={StepOne} />
        <SignUpStepsStack.Screen name="StepTwo" component={StepTwo} />
      </SignUpStepsStack.Navigator>
    </SignUpStepsProvider>
  );
};

export default SignUp;
