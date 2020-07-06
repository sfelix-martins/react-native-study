import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, TextInput as TextInputProps, View } from 'react-native';
import { HelperText } from 'react-native-paper';
import * as Yup from 'yup';

import { useNavigation } from '@react-navigation/native';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/mobile';

import { Input, StepperContainer, Switch } from '../../../components/Forms';
import {
  useSignUpStepper,
  StepThreeData,
} from '../../../contexts/signup-steps';
import getValidationErrors from '../../../utils/getValidationErrors';
import { useGlobalLoader } from '../../../contexts/global-loader';

interface FormValues {
  site?: string;
  company?: string;
  areaCode?: string;
  phone?: string;
  certified: boolean;
}

const FormSchema = Yup.object().shape({
  site: Yup.string().url('The contact link must to be a valid url'),
  company: Yup.string().max(50, 'The company must have until 10 characters'),
  areaCode: Yup.string().test(
    'len',
    'Invalid area code',
    (val) => !val || val.toString().length === 2,
  ),
  phone: Yup.string().test(
    'len',
    'Invalid phone number',
    (val) => !val || val.toString().length === 9,
  ),
});

const StepThree: React.FC = () => {
  const {
    goToNextStep,
    setValidationSchema,
    finishSignUp,
  } = useSignUpStepper();

  const { openGlobalLoader, closeGlobalLoader } = useGlobalLoader();

  const [submitted, setSubmitted] = useState(false);
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [areaCodeTouched, setAreaCodeTouched] = useState(false);
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
      const stepData: StepThreeData = {
        ...data,
        whatsapp: `${data.areaCode}${data.phone}`,
      };

      try {
        formRef.current?.setErrors({});

        await goToNextStep(stepData);

        openGlobalLoader();
        await finishSignUp();

        navigation.navigate('SignIn');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          setSubmitted(true);

          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }
      } finally {
        closeGlobalLoader();
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
          submitted={submitted}
          blurOnSubmit={false}
          onBlur={() => handleBlur('site')}
          onChangeText={(value) => handleChangeText('site', value)}
          name="site"
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
          submitted={submitted}
          blurOnSubmit={false}
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
              submitted={submitted}
              showErrorMessage={false}
              blurOnSubmit={false}
              name="areaCode"
              label="DDD"
              onBlur={() => {
                setAreaCodeTouched(true);
                handleBlur('areaCode');
              }}
              onChangeText={(value) => {
                handleChangeText('areaCode', value);
                if (value.length === 2) {
                  phoneRef.current?.focus();
                }
              }}
              onKeyPress={({ nativeEvent }) => {
                const areaCodeValue: string = formRef.current?.getFieldValue(
                  'areaCode',
                );
                if (
                  areaCodeValue.length === 2 &&
                  nativeEvent.key !== 'Backspace'
                ) {
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
              ref={phoneRef}
              maskType="cel-phone"
              submitted={submitted}
              maskOptions={{
                withDDD: false,
                maskType: 'BRL',
              }}
              onKeyPress={({ nativeEvent }) => {
                if (nativeEvent.key === 'Backspace') {
                  const phoneValue: string = formRef.current?.getFieldValue(
                    'phone',
                  );

                  if (phoneValue.length === 0) {
                    areaCodeRef.current?.focus();
                    const areaCodeValueLessLastChar: string = formRef.current
                      ?.getFieldValue('areaCode')
                      .slice(0, -1);
                    formRef.current?.setFieldValue(
                      'areaCode',
                      areaCodeValueLessLastChar,
                    );
                  }
                }
              }}
              showErrorMessage={false}
              onBlur={() => {
                setPhoneTouched(true);
                handleBlur('phone');
              }}
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
        {((hasPhoneError && phoneTouched) ||
          (hasAreaCodeError && areaCodeTouched)) && (
          <HelperText type="error">Type a valid phone number</HelperText>
        )}

        <View style={styles.switch}>
          <Switch name="certified">I'm certifed</Switch>
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
