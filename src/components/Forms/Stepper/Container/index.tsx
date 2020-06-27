import React from 'react';
import { StatusBar } from 'react-native';
import { Appbar, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const Container: React.FC = ({ children }) => {
  const navigation = useNavigation();

  const { colors } = useTheme();
  return (
    <>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
      <Appbar.Header
        style={{ backgroundColor: colors.primary }}
        accessibilityStates>
        <Appbar.BackAction accessibilityStates onPress={navigation.goBack} />
      </Appbar.Header>
      {children}
    </>
  );
};

export default Container;
