import { Formik } from 'formik';
import React, { useRef } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  TextInput as TextInputProps,
  View,
} from 'react-native';
import { Button, HelperText, TextInput } from 'react-native-paper';
import * as Yup from 'yup';

import { useNavigation } from '@react-navigation/native';

import logo from '../../assets/logo.png';
import { useAuth } from '../../contexts/auth';
import { useToast } from '../../contexts/toast';
import { useGlobalLoader } from '../../contexts/global-loader';

interface SignInValues {
  email: string;
  password: string;
}

const SignInSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('The email is required'),
  password: Yup.string().required('The password is required'),
});

const SignIn: React.FC = () => {
  const { openGlobalLoader, closeGlobalLoader } = useGlobalLoader();

  const passwordRef = useRef<TextInputProps>(null);
  const navigation = useNavigation();

  const { openDialog } = useToast();

  const { signIn } = useAuth();

  const initialValues: SignInValues = { email: '', password: '' };

  async function handleSignIn(values: SignInValues) {
    try {
      openGlobalLoader();
      await signIn(values);
    } catch (err) {
      openDialog({
        type: 'error',
        message: 'Invalid credentials',
      });
    } finally {
      closeGlobalLoader();
    }
  }

  return (
    <ScrollView>
      <View style={styles.container}>
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
            <View style={styles.form}>
              <Image style={styles.logo} source={logo} />
              <TextInput
                style={styles.textInput}
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
                style={styles.textInput}
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
            </View>
          )}
        </Formik>

        <Button
          accessibilityStates
          onPress={() => navigation.navigate('SignUp')}>
          Register
        </Button>
      </View>
    </ScrollView>
  );
};

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    height,
    flexGrow: 1,
    flex: 1,
    padding: 24,
    // justifyContent: 'space-between',
    // alignItems: 'center',
    // backgroundColor: 'blue',
  },
  fill: {
    flex: 1,
    backgroundColor: 'red',
    width: '100%',
    height: '100%',
  },
  form: {
    width: '100%',
    height: '90%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    marginBottom: 30,
  },
  textInput: {
    width: '100%',
  },
  button: {
    width: '100%',
    marginTop: 16,
    marginBottom: 16,
    borderRadius: 50,
    height: 50,
    justifyContent: 'center',
  },
});

export default SignIn;