import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, TextInput as TextInputProps, View } from 'react-native';
import { HelperText } from 'react-native-paper';
import * as Yup from 'yup';

import { useNavigation } from '@react-navigation/native';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/mobile';

import { Input, StepperContainer, Switch } from '../../../components/Forms';
import { useSignUpStepper } from '../../../contexts/signup-steps';
import getValidationErrors from '../../../utils/getValidationErrors';
import { useGlobalLoader } from '../../../contexts/global-loader';

interface FormValues {
  contactLink?: string;
  company?: string;
  phone?: string;
  isCertified: boolean;
}

const FormSchema = Yup.object().shape({
  contactLink: Yup.string().url('The contact link must to be a valid url'),
  company: Yup.string().max(50, 'The company must have until 10 characters'),
  areaCode: Yup.string().max(2).min(2).nullable(),
  phone: Yup.string().max(9).min(9).nullable(),
});

const StepThree: React.FC = () => {
  const {
    goToNextStep,
    setValidationSchema,
    finishSignUp,
  } = useSignUpStepper();

  const { openGlobalLoader, closeGlobalLoader } = useGlobalLoader();

  const [hasPhoneError, setHasPhoneError] = useState(false);
  const [hasAreaCodeError, setHasAreaCodeError] = useState(false);

  const formRef = useRef<FormHandles>(null);
  const companyRef = useRef<TextInputProps>(null);
  const phoneRef = useRef<TextInputProps>(null);
  const areaCodeRef = useRef<TextInputProps>(null);

  const navigation = useNavigation();

  useEffect(() => setValidationSchema(FormSchema), [setValidationSchema]);

  const nextStep = useCallback(
    async (data: FormValues) => {
      try {
        formRef.current?.setErrors({});

        await goToNextStep(data);

        openGlobalLoader();
        await finishSignUp();

        closeGlobalLoader();

        navigation.navigate('SignIn');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }
      }
    },
    [
      closeGlobalLoader,
      finishSignUp,
      goToNextStep,
      navigation,
      openGlobalLoader,
    ],
  );

  const validateField = useCallback(async (field: string, value: string) => {
    try {
      await Yup.reach(FormSchema, field).validate(value);

      formRef.current?.setErrors({
        ...formRef.current.getErrors(),
        [field]: undefined,
      });
      if (field === 'phone') {
        setHasPhoneError(false);
      }
      if (field === 'areaCode') {
        setHasAreaCodeError(false);
      }
    } catch (err) {
      const error = err as Yup.ValidationError;

      formRef.current?.setFieldError(field, error.message);
      if (field === 'phone') {
        setHasPhoneError(true);
      }
      if (field === 'areaCode') {
        setHasAreaCodeError(true);
      }
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
          autoFocus
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
          onSubmitEditing={() => areaCodeRef.current?.focus()}
        />
        <View style={styles.phoneContainer}>
          <View style={styles.phoneAreaCode}>
            <Input
              ref={areaCodeRef}
              showErrorMessage={false}
              name="areaCode"
              label="DDD"
              onBlur={() => handleBlur('areaCode')}
              onChangeText={(value) => {
                handleChangeText('areaCode', value);
                if (value.length === 2) {
                  phoneRef.current?.focus();
                }
              }}
              maxLength={2}
              returnKeyType="next"
              keyboardType="phone-pad"
              autoCapitalize="none"
              autoCorrect={false}
              mode="outlined"
              onSubmitEditing={() => phoneRef.current?.focus()}
            />
          </View>
          <View style={styles.phoneNumber}>
            <Input
              maskType="cel-phone"
              maskOptions={{
                withDDD: false,
                maskType: 'BRL',
              }}
              showErrorMessage={false}
              ref={phoneRef}
              onBlur={() => handleBlur('phone')}
              onChangeText={(value) => {
                handleChangeText('phone', value);
              }}
              name="phone"
              label="Celular"
              returnKeyType="next"
              keyboardType="phone-pad"
              autoCapitalize="none"
              autoCorrect={false}
              mode="outlined"
            />
          </View>
        </View>
        {(hasPhoneError || hasAreaCodeError) && (
          <HelperText type="error">Type a valid phone number</HelperText>
        )}

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

  phoneContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  phoneAreaCode: { width: '20%' },
  phoneNumber: { width: '78%' },
});

export default StepThree;
