import React from 'react';
import { Text } from 'react-native';
import { Button } from 'react-native-paper';

import { useNavigation } from '@react-navigation/native';

import { StepperContainer } from '../../../components/Forms';

const StepTwo: React.FC = () => {
  const navigation = useNavigation();

  function nextStep() {
    navigation.navigate('StepTwo');
  }

  return (
    <StepperContainer>
      <Text>Step 2</Text>
      <Button accessibilityStates onPress={nextStep}>
        Next
      </Button>
    </StepperContainer>
  );
};

export default StepTwo;
