import React, { useRef } from 'react';
import { View, StyleSheet, TextInput as TextInputProps } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import { Button, TextInput } from 'react-native-paper';

const SignIn: React.FC = () => {
  const { colors } = useTheme();
  const passwordRef = useRef<TextInputProps>(null);
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.fill}
        keyboardAppearance="dark"
        returnKeyType="next"
        autoCorrect={false}
        autoCapitalize="none"
        keyboardType="email-address"
        mode="outlined"
        accessibilityStates
        label="E-mail"
        onSubmitEditing={() => passwordRef.current?.focus()}
      />
      <TextInput
        style={styles.fill}
        ref={passwordRef}
        keyboardAppearance="dark"
        returnKeyType="send"
        secureTextEntry={true}
        mode="outlined"
        accessibilityStates
        label="Password"
      />
      <Button
        style={styles.fill}
        mode="contained"
        accessibilityStates="Login"
        onPress={() => navigation.navigate('SignUp')}>
        Login
      </Button>
      <Button accessibilityStates onPress={() => console.log('Pressed')}>
        Recovery password
      </Button>
      <Button accessibilityStates onPress={() => console.log('Pressed')}>
        Register
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  fill: {
    width: '100%',
  },
});

export default SignIn;
