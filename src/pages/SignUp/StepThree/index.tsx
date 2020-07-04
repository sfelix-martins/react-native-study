import React, { useCallback, useEffect, useRef } from 'react';
import { StyleSheet, TextInput as TextInputProps, View } from 'react-native';
import * as Yup from 'yup';

import { useNavigation } from '@react-navigation/native';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/mobile';

import { Input, StepperContainer } from '../../../components/Forms';
import Switch from '../../../components/Forms/Switch';
import { useSignUpStepper } from '../../../contexts/signup-steps';
import getValidationErrors from '../../../utils/getValidationErrors';

interface FormValues {
  contactLink?: string;
  company?: string;
  phone?: string;
  isCertified: boolean;
}

const FormSchema = Yup.object().shape({
  contactLink: Yup.string().url('The contact link must to be a valid url'),
  company: Yup.string().max(50, 'The company must have until 10 characters'),
  phone: Yup.string().nullable(),
});

const StepThree: React.FC = () => {
  const { goToNextStep, setValidationSchema } = useSignUpStepper();

  const formRef = useRef<FormHandles>(null);
  const companyRef = useRef<TextInputProps>(null);
  const phoneRef = useRef<TextInputProps>(null);

  const navigation = useNavigation();

  useEffect(() => setValidationSchema(FormSchema), [setValidationSchema]);

  const nextStep = useCallback(
    async (data: FormValues) => {
      try {
        formRef.current?.setErrors({});

        await goToNextStep(data);

        console.log('Data', data);
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }
      }

      // navigation.navigate('StepTwo');
    },
    [goToNextStep],
  );

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
        <View style={styles.switch}>
          <Switch name="isCertified">I'm certifed</Switch>
        </View>
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
    marginTop: 8,
  },
});

export default StepThree;
