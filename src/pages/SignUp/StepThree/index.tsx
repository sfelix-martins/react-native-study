import React, { useRef } from 'react';
import { View, StyleSheet, TextInput as TextInputProps } from 'react-native';
import { TextInput, HelperText, Switch, Text } from 'react-native-paper';

import { useNavigation } from '@react-navigation/native';

import * as Yup from 'yup';

import {
  StepperContainer,
  FormContainer,
  ContainedButton,
} from '../../../components/Forms';
import { Formik } from 'formik';
import { useSignUpStepper } from '../../../contexts/signup-steps';

interface FormValues {
  contactLink?: string;
  company?: string;
  phone?: string;
  isCertified: boolean;
}

const FormSchema = Yup.object().shape({
  contactLink: Yup.string().url('The contact link must to be a valid url'),
  company: Yup.string().max(50, 'The company must have until 10 characters'),
});

const StepThree: React.FC = () => {
  const { goToNextStep } = useSignUpStepper();
  const companyRef = useRef<TextInputProps>(null);
  const phoneRef = useRef<TextInputProps>(null);

  const navigation = useNavigation();

  const intialValues: FormValues = {
    contactLink: '',
    company: '',
    phone: '',
    isCertified: false,
  };

  function nextStep(data: FormValues) {
    goToNextStep(data);
    // navigation.navigate('StepFour');
  }

  return (
    <StepperContainer>
      <FormContainer>
        <Formik
          initialValues={intialValues}
          validationSchema={FormSchema}
          onSubmit={(values) => {
            nextStep(values);
          }}>
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
            values,
            errors,
            touched,
          }) => (
            <View style={{ flex: 1, padding: 24 }}>
              <View style={styles.container}>
                <TextInput
                  style={styles.fill}
                  error={!!errors.contactLink && touched.contactLink}
                  value={values.contactLink}
                  onChangeText={handleChange('contactLink')}
                  onBlur={handleBlur('contactLink')}
                  returnKeyType="next"
                  autoCapitalize="none"
                  mode="outlined"
                  accessibilityStates
                  keyboardType="url"
                  label="Contact link"
                  onSubmitEditing={() => companyRef.current?.focus()}
                />
                {touched.contactLink && errors.contactLink && (
                  <HelperText type="error">{errors.contactLink}</HelperText>
                )}

                <TextInput
                  ref={companyRef}
                  style={styles.fill}
                  error={!!errors.company && touched.company}
                  value={values.company}
                  onChangeText={handleChange('company')}
                  onBlur={handleBlur('company')}
                  returnKeyType="next"
                  autoCapitalize="none"
                  mode="outlined"
                  accessibilityStates
                  label="Company"
                  onSubmitEditing={() => phoneRef.current?.focus()}
                />
                {touched.company && errors.company && (
                  <HelperText type="error">{errors.company}</HelperText>
                )}

                <TextInput
                  ref={phoneRef}
                  style={styles.fill}
                  error={!!errors.phone && touched.phone}
                  value={values.phone}
                  onChangeText={handleChange('phone')}
                  onBlur={handleBlur('phone')}
                  autoCapitalize="none"
                  mode="outlined"
                  accessibilityStates
                  keyboardType="phone-pad"
                  label="Phone"
                />
                {touched.phone && errors.phone && (
                  <HelperText type="error">{errors.phone}</HelperText>
                )}

                <View style={styles.switch}>
                  <Switch
                    style={{ marginRight: 16 }}
                    accessibilityStates
                    onValueChange={() =>
                      setFieldValue('isCertified', !values.isCertified)
                    }
                    value={values.isCertified}
                  />
                  <Text accessibilityStates>I'm a certified analyst</Text>
                </View>
              </View>
              <ContainedButton style={styles.button} onPress={handleSubmit}>
                Next
              </ContainedButton>
            </View>
          )}
        </Formik>
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
  fill: {
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
