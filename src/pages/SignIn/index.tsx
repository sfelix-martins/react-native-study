import React, { useCallback, useRef, useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  TextInput as TextInputProps,
  View,
} from 'react-native';
import { Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Yup from 'yup';

import { useNavigation, useTheme } from '@react-navigation/native';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/mobile';

import { ContainedButton, Input } from '../../components/Forms';
import Logo from '../../components/Logo';
import { useAuth } from '../../contexts/auth';
import { useGlobalLoader } from '../../contexts/global-loader';
import { useToast } from '../../contexts/toast';
import getValidationErrors from '../../utils/getValidationErrors';

interface SignInValues {
  email: string;
  password: string;
}

const SignInSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('The email is required'),
  password: Yup.string().required('The password is required'),
});

const SignIn: React.FC = () => {
  const { colors } = useTheme();

  const [emailTouched, setEmailTouched] = useState(false);

  const { openGlobalLoader, closeGlobalLoader } = useGlobalLoader();

  const passwordRef = useRef<TextInputProps>(null);
  const navigation = useNavigation();
  const formRef = useRef<FormHandles>(null);

  const { openDialog } = useToast();

  const { signIn } = useAuth();

  const handleBlur = useCallback((field: string) => {
    validateField(field, formRef.current?.getFieldValue(field));
    if (field === 'email') {
      setEmailTouched(true);
    }
  }, []);

  const handleChangeText = useCallback((field: string, value: string) => {
    validateField(field, value);
  }, []);

  async function validateField(field: string, value: string) {
    try {
      await Yup.reach(SignInSchema, field).validate(value);

      formRef.current?.setErrors({
        ...formRef.current.getErrors(),
        [field]: undefined,
      });
    } catch (err) {
      const error = err as Yup.ValidationError;

      formRef.current?.setFieldError(field, error.message);
    }
  }

  const handleSignIn = useCallback(
    async (values: SignInValues) => {
      try {
        await SignInSchema.validate(values, {
          abortEarly: false,
        });

        openGlobalLoader();
        await signIn(values);
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);
          return;
        }

        openDialog({
          type: 'error',
          message: 'Invalid credentials',
        });
      } finally {
        closeGlobalLoader();
      }
    },
    [closeGlobalLoader, openDialog, openGlobalLoader, signIn],
  );

  return (
    <SafeAreaView>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <Form style={styles.form} ref={formRef} onSubmit={handleSignIn}>
            <Logo style={styles.logo} />
            <Input
              onBlur={() => handleBlur('email')}
              onChangeText={(value) => handleChangeText('email', value)}
              name="email"
              label="E-mail"
              style={styles.textInput}
              keyboardAppearance="dark"
              returnKeyType="next"
              autoCorrect={false}
              mode="outlined"
              autoCapitalize="none"
              keyboardType="email-address"
              onSubmitEditing={() => passwordRef.current?.focus()}
            />
            <Input
              onBlur={() => handleBlur('password')}
              onChangeText={(value) => handleChangeText('password', value)}
              ref={passwordRef}
              mode="outlined"
              label="Password"
              style={styles.textInput}
              secureTextEntry
              keyboardAppearance="dark"
              returnKeyType="send"
              name="password"
            />
            <ContainedButton
              style={styles.button}
              onPress={() => {
                formRef.current?.submitForm();
              }}>
              Login
            </ContainedButton>
            <Button
              accessibilityStates
              onPress={() => {
                formRef.current?.reset();
                navigation.navigate('ForgotPassword');
              }}>
              Recovery password
            </Button>
          </Form>
          <Button
            accessibilityStates
            onPress={() => {
              navigation.navigate('SignUp');
            }}>
            Register
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    height,
    flexGrow: 1,
    flex: 1,
    padding: 24,
  },
  fill: {
    flex: 1,
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
    marginTop: 16,
    marginBottom: 16,
  },
});

export default SignIn;
