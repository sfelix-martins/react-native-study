import React, { useEffect, useRef, useState } from 'react';
import { SwitchProps as BaseProps, View, Text, StyleSheet } from 'react-native';
import { Switch as BaseSwitch, Theme } from 'react-native-paper';

import { useField } from '@unform/core';

interface SwitchProps extends BaseProps {
  name: string;
  theme?: Theme;
  children: string;
}

interface SwitchValueReference {
  value: boolean;
}

const Switch: React.FC<SwitchProps> = ({ name, children, ...rest }) => {
  const inputElementRef = useRef<any>(null);

  const { registerField, defaultValue = false, fieldName } = useField(name);

  const [checked, setChecked] = useState<boolean>(defaultValue);
  const inputValueRef = useRef<SwitchValueReference>({ value: checked });

  useEffect(() => {
    registerField<boolean>({
      name: fieldName,
      ref: inputValueRef.current,
      path: 'value',
    });
  }, [fieldName, registerField]);

  return (
    <View style={styles.container}>
      <BaseSwitch
        accessibilityStates
        ref={inputElementRef}
        onValueChange={() => {
          inputValueRef.current.value = !checked;
          setChecked(!checked);
        }}
        value={checked}
        {...rest}
      />
      <Text style={styles.text}>{children}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    marginLeft: 16,
  },
});

export default Switch;
