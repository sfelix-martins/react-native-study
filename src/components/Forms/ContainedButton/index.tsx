import React from 'react';
import { StyleSheet } from 'react-native';
import { Button as MaterialButton } from 'react-native-paper';

import { MaterialButtonProps } from '../../../@types/react-native-paper/Button';

const ContainedButton: React.FC<MaterialButtonProps> = ({ style, ...rest }) => {
  return (
    <MaterialButton
      accessibilityStates
      {...rest}
      style={[styles.button, style]}
      mode="contained"
    />
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    borderRadius: 50,
    height: 50,
    justifyContent: 'center',
  },
});

export default ContainedButton;
