import React, { useRef, useCallback } from 'react';
import { StyleSheet, TextInput as TextInputProps } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import * as Yup from 'yup';

import { StepperContainer, Input } from '../../../components/Forms';
import { useSignUpStepper } from '../../../contexts/signup-steps';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';

interface FormValues {
  contactLink?: string;
  company?: string;
  phone?: string;
  isCertified: boolean;
}

const FormSchema = Yup.object().shape({
  contactLink: Yup.string().url('The contact link must to be a valid url'),
  company: Yup.string().max(50, 'The company must have until 10 characters'),
  phone: Yup.string().min(10),
});

const StepThree: React.FC = () => {
  const { goToNextStep } = useSignUpStepper();
  const formRef = useRef<FormHandles>(null);
  const companyRef = useRef<TextInputProps>(null);
  const phoneRef = useRef<TextInputProps>(null);

  const navigation = useNavigation();

  function nextStep(data: FormValues) {
    console.log('Data', data);
    goToNextStep(data);
    // navigation.navigate('StepFour');
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
          onBlur={() => handleBlur('contactLink')}
          onChangeText={(value) => handleChangeText('contactLink', value)}
          name="contactLink"
          label="Contact link"
          style={styles.textInput}
          returnKeyType="next"
          autoCorrect={false}
          mode="outlined"
          keyboardType="url"
          autoCapitalize="none"
          onSubmitEditing={() => companyRef.current?.focus()}
        />
        <Input
          ref={companyRef}
          onBlur={() => handleBlur('company')}
          onChangeText={(value) => handleChangeText('company', value)}
          name="company"
          label="Company"
          style={styles.textInput}
          returnKeyType="next"
          autoCorrect={false}
          mode="outlined"
          onSubmitEditing={() => phoneRef.current?.focus()}
        />
        <Input
          ref={phoneRef}
          onBlur={() => handleBlur('phone')}
          onChangeText={(value) => handleChangeText('phone', value)}
          name="phone"
          label="Phone"
          style={styles.textInput}
          returnKeyType="next"
          keyboardType="phone-pad"
          autoCapitalize="none"
          autoCorrect={false}
          mode="outlined"
          onSubmitEditing={() => phoneRef.current?.focus()}
        />
        {/* <Switch style={{ marginRight: 16 }}
        accessibilityStates onValueChange=
        {() => setFieldValue('isCertified', !values.isCertified)}
        value={values.isCertified}
        /> */}
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
  switch: {
    width: '100%',
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default StepThree;
