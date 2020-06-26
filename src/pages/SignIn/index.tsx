import { Formik } from 'formik';
import React, { useRef } from 'react';
import { StyleSheet, TextInput as TextInputProps, View } from 'react-native';
import { Button, HelperText, TextInput } from 'react-native-paper';
import * as Yup from 'yup';

import { useNavigation } from '@react-navigation/native';

import { useAuth } from '../../contexts/auth';
import { useToast } from '../../contexts/toast';

interface SignInValues {
  email: string;
  password: string;
}

const SignInSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('The email is required'),
  password: Yup.string().required('The password is required'),
});

const SignIn: React.FC = () => {
  const passwordRef = useRef<TextInputProps>(null);
  const navigation = useNavigation();

  const { openDialog } = useToast();

  const { signIn } = useAuth();

  const initialValues: SignInValues = { email: '', password: '' };

  async function handleSignIn(values: SignInValues) {
    try {
      await signIn(values);
    } catch (err) {
      openDialog({
        type: 'error',
        message: 'Invalid credentials',
      });
    }
  }

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={SignInSchema}
        onSubmit={handleSignIn}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <View style={styles.container}>
            <TextInput
              style={styles.fill}
              error={!!errors.email && touched.email}
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
            {touched.email && errors.email && (
              <HelperText type="error">{errors.email}</HelperText>
            )}

            <TextInput
              error={!!errors.password && touched.password}
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
            {errors.password && touched.password && (
              <HelperText type="error">{errors.password}</HelperText>
            )}

            <Button
              style={styles.button}
              mode="contained"
              accessibilityStates="Login"
              onPress={handleSubmit}>
              Login
            </Button>
            <Button
              accessibilityStates
              onPress={() => navigation.navigate('ForgotPassword')}>
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
    </>
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
