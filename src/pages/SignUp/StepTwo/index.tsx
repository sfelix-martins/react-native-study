import React, { useRef, useCallback } from 'react';
import { StyleSheet, TextInput as TextInputProps } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import * as Yup from 'yup';

import { StepperContainer, Input } from '../../../components/Forms';
import { useSignUpStepper } from '../../../contexts/signup-steps';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';

interface FormValues {
  email: string;
  password: string;
}

const FormSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('The email is required'),
  password: Yup.string()
    .min(6, 'The password must to be at least 6 characters')
    .max(10, 'The password must until 10 characters')
    .required('The password is required'),
});

const StepTwo: React.FC = () => {
  const { goToNextStep } = useSignUpStepper();
  const formRef = useRef<FormHandles>(null);
  const passwordRef = useRef<TextInputProps>(null);

  const navigation = useNavigation();

  function nextStep(data: FormValues) {
    goToNextStep(data);
    navigation.navigate('StepThree');
  }

  const validateField = useCallback(async (field: string, value: string) => {
    try {
      await Yup.reach(FormSchema, field).validate(value);

      formRef.current?.setErrors({
        ...formRef.current.getErrors(),
        [field]: undefined,
      });
    } catch (err) {
      const error = err as Yup.ValidationError;

      formRef.current?.setFieldError(field, error.message);
    }
  }, []);

  const handleBlur = useCallback(
    (field: string) => {
      validateField(field, formRef.current?.getFieldValue(field));
    },
    [validateField],
  );

  const handleChangeText = useCallback(
    (field: string, value: string) => {
      validateField(field, value);
    },
    [validateField],
  );

  return (
    <StepperContainer onNext={() => formRef.current?.submitForm()}>
      <Form style={styles.container} ref={formRef} onSubmit={nextStep}>
        <Input
          onBlur={() => handleBlur('email')}
          onChangeText={(value) => handleChangeText('email', value)}
          name="email"
          label="E-mail"
          style={styles.textInput}
          returnKeyType="next"
          autoCorrect={false}
          mode="outlined"
          keyboardType="email-address"
          autoCapitalize="none"
          onSubmitEditing={() => passwordRef.current?.focus()}
        />

        <Input
          ref={passwordRef}
          onBlur={() => handleBlur('password')}
          onChangeText={(value) => handleChangeText('password', value)}
          name="password"
          label="Password"
          secureTextEntry
          style={styles.textInput}
          returnKeyType="send"
          autoCorrect={false}
          mode="outlined"
          onSubmitEditing={() => formRef.current?.submitForm()}
        />
      </Form>
    </StepperContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  logo: {
    marginBottom: 16,
  },
  textInput: {
    width: '100%',
  },
  button: {
    marginTop: 16,
    marginBottom: 16,
  },
});

export default StepTwo;
