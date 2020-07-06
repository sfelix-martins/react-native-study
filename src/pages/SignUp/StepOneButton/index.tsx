import React, { useCallback, useRef, useEffect, useState } from 'react';
import { StyleSheet, TextInput as TextInputProps, View } from 'react-native';
import * as Yup from 'yup';

import { useNavigation } from '@react-navigation/native';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/mobile';

import { Input, StepperContainer } from '../../../components/Forms';
import { useSignUpStepper } from '../../../contexts/signup-steps';
import getValidationErrors from '../../../utils/getValidationErrors';

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

  const [submitted, setSubmitted] = useState(false);

  const { goToNextStep, setValidationSchema } = useSignUpStepper();
  const navigation = useNavigation();

  const lastNameRef = useRef<TextInputProps>(null);

  useEffect(() => setValidationSchema(FormSchema), [setValidationSchema]);

  const nextStep = useCallback(
    async (data: FormValues) => {
      try {
        formRef.current?.setErrors({});

        await goToNextStep(data);
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          setSubmitted(true);

          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }
      }

      navigation.navigate('StepTwo');
    },
    [goToNextStep, navigation],
  );

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
          submitted={submitted}
          autoFocus
          onBlur={() => handleBlur('firstName')}
          onChangeText={(value) => handleChangeText('firstName', value)}
          name="firstName"
          label="First Name"
          blurOnSubmit={false}
          style={styles.textInput}
          returnKeyType="next"
          autoCorrect={false}
          mode="outlined"
          autoCapitalize="words"
          onSubmitEditing={() => lastNameRef.current?.focus()}
        />

        <Input
          submitted={submitted}
          ref={lastNameRef}
          onBlur={() => handleBlur('lastName')}
          onChangeText={(value) => handleChangeText('lastName', value)}
          name="lastName"
          label="Last Name"
          style={styles.textInput}
          returnKeyType="send"
          blurOnSubmit={false}
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
