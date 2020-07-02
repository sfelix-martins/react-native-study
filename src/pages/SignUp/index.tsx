import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import SignUpStepsProvider from '../../contexts/signup-steps';
import StepOne from './StepOne';
import StepOneButton from './StepOneButton';
import StepThree from './StepThree';
import StepTwo from './StepTwo';

const SignUpStepsStack = createStackNavigator();

const SignUp: React.FC = () => {
  return (
    <SignUpStepsProvider>
      <SignUpStepsStack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName="StepOne">
        <SignUpStepsStack.Screen name="StepOne" component={StepOneButton} />
        <SignUpStepsStack.Screen name="StepTwo" component={StepTwo} />
        <SignUpStepsStack.Screen name="StepThree" component={StepThree} />
      </SignUpStepsStack.Navigator>
    </SignUpStepsProvider>
  );
};

export default SignUp;
