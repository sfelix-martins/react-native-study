import React, { useCallback, useRef } from 'react';
import { StyleSheet, TextInput as TextInputProps, View } from 'react-native';
import * as Yup from 'yup';

import { useNavigation } from '@react-navigation/native';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/mobile';

import {
  ContainedButton,
  FormContainer,
  Input,
  StepperContainer,
} from '../../../components/Forms';
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
    <StepperContainer>
      <FormContainer>
        <View style={{ flex: 1, padding: 24 }}>
          <Form style={styles.container} ref={formRef} onSubmit={nextStep}>
            <Input
              onBlur={() => handleBlur('firstName')}
              onChangeText={(value) => handleChangeText('firstName', value)}
              name="firstName"
              label="First Name"
              style={styles.textInput}
              keyboardAppearance="dark"
              returnKeyType="next"
              autoCorrect={false}
              mode="outlined"
              autoCapitalize="words"
              onSubmitEditing={() => lastNameRef.current?.focus()}
            />

            <Input
              onBlur={() => handleBlur('lastName')}
              onChangeText={(value) => handleChangeText('lastName', value)}
              name="lastName"
              label="Last Name"
              style={styles.textInput}
              keyboardAppearance="dark"
              returnKeyType="send"
              autoCorrect={false}
              mode="outlined"
              autoCapitalize="words"
              onSubmitEditing={() => formRef.current?.submitForm()}
            />
          </Form>
          <ContainedButton
            style={styles.button}
            onPress={() => {
              formRef.current?.submitForm();
            }}>
            Next
          </ContainedButton>
        </View>
      </FormContainer>
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

export default StepOne;
