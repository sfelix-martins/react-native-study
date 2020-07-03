import React, { useCallback, useRef } from 'react';
import { StyleSheet, TextInput as TextInputProps } from 'react-native';
import * as Yup from 'yup';

import { useNavigation } from '@react-navigation/native';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/mobile';

import { Input, StepperContainer } from '../../../components/Forms';
import { useSignUpStepper } from '../../../contexts/signup-steps';

interface FormValues {
  firstName: string;
  lastName: string;
}

const FormSchema = Yup.object().shape({
  firstName: Yup.string().required('The first name is required'),
  lastName: Yup.string().required('The last name is required'),
});

const StepOne: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const { goToNextStep } = useSignUpStepper();
  const navigation = useNavigation();

  const lastNameRef = useRef<TextInputProps>(null);

  function nextStep(values: FormValues) {
    // TODO: Validate steps data on context or component??
    goToNextStep(values);
    navigation.navigate('StepTwo');
  }

  const handleBlur = useCallback((field: string) => {
    validateField(field, formRef.current?.getFieldValue(field));
  }, []);

  const handleChangeText = useCallback((field: string, value: string) => {
    validateField(field, value);
  }, []);

  async function validateField(field: string, value: string) {
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
  }

  return (
    <StepperContainer onNext={() => formRef.current?.submitForm()}>
      <Form style={styles.container} ref={formRef} onSubmit={nextStep}>
        <Input
          onBlur={() => handleBlur('firstName')}
          onChangeText={(value) => handleChangeText('firstName', value)}
          name="firstName"
          label="First Name"
          style={styles.textInput}
          returnKeyType="next"
          autoCorrect={false}
          mode="outlined"
          autoCapitalize="words"
          onSubmitEditing={() => lastNameRef.current?.focus()}
        />

        <Input
          ref={lastNameRef}
          onBlur={() => handleBlur('lastName')}
          onChangeText={(value) => handleChangeText('lastName', value)}
          name="lastName"
          label="Last Name"
          style={styles.textInput}
          returnKeyType="send"
          autoCorrect={false}
          mode="outlined"
          autoCapitalize="words"
          onSubmitEditing={() => formRef.current?.submitForm()}
        />
      </Form>
    </StepperContainer>
  );
};

const styles = StyleSheet.create({
  textInput: {
    width: '100%',
  },
  container: {
    flex: 1,
  },
});

export default StepOne;
