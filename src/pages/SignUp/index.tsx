import React from 'react';
import { StatusBar, SafeAreaView } from 'react-native';
import { useTheme } from '@react-navigation/native';

const SignUp: React.FC = () => {
  const { colors } = useTheme();

  return (
    <>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor={colors.primary}
      />

      {/* <Appbar.Header accessibilityStates>
        <Appbar.BackAction
          accessibilityStates
          onPress={() => navigation.goBack()}
        />
      </Appbar.Header> */}
    </>
  );
};

export default SignUp;
