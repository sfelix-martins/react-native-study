import React, { useRef } from 'react';
import { View, StyleSheet, TextInput as TextInputProps } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, TextInput } from 'react-native-paper';
import { Formik } from 'formik';

interface SignInValues {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const passwordRef = useRef<TextInputProps>(null);
  const navigation = useNavigation();

  const intialValues: SignInValues = { email: '', password: '' };

  return (
    <Formik
      initialValues={intialValues}
      onSubmit={(values) => console.log('values', values)}>
      {({ handleChange, handleBlur, handleSubmit, values }) => (
        <View style={styles.container}>
          <TextInput
            style={styles.fill}
            value={values.email}
            onChangeText={handleChange('email')}
            onBlur={handleBlur('email')}
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
            value={values.password}
            onChangeText={handleChange('password')}
            onBlur={handleBlur('password')}
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
            style={styles.button}
            mode="contained"
            accessibilityStates="Login"
            onPress={handleSubmit}>
            Login
          </Button>
          <Button accessibilityStates onPress={() => console.log('Pressed')}>
            Recovery password
          </Button>
          <Button
            accessibilityStates
            onPress={() => navigation.navigate('SignUp')}>
            Register
          </Button>
        </View>
      )}
    </Formik>
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
  button: {
    width: '100%',
    marginTop: 16,
    marginBottom: 16,
  },
});

export default SignIn;
