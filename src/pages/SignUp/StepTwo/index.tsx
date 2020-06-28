import React, { useRef } from 'react';
import { View, StyleSheet, TextInput as TextInputProps } from 'react-native';
import { TextInput, HelperText } from 'react-native-paper';

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
  const passwordRef = useRef<TextInputProps>(null);

  const navigation = useNavigation();

  const intialValues: FormValues = { email: '', password: '' };

  function nextStep(data: FormValues) {
    goToNextStep(data);
    navigation.navigate('StepThree');
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
            values,
            errors,
            touched,
          }) => (
            <View style={{ flex: 1, padding: 24 }}>
              <View style={styles.container}>
                <TextInput
                  style={styles.fill}
                  error={!!errors.email && touched.email}
                  value={values.email}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  returnKeyType="next"
                  autoCapitalize="none"
                  mode="outlined"
                  accessibilityStates
                  keyboardType="email-address"
                  label="E-mail"
                  onSubmitEditing={() => passwordRef.current?.focus()}
                />
                {touched.email && errors.email && (
                  <HelperText type="error">{errors.email}</HelperText>
                )}

                <TextInput
                  ref={passwordRef}
                  style={styles.fill}
                  error={!!errors.password && touched.password}
                  value={values.password}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  returnKeyType="send"
                  autoCapitalize="none"
                  secureTextEntry
                  mode="outlined"
                  accessibilityStates
                  label="Password"
                  onSubmitEditing={handleSubmit}
                />
                {touched.password && errors.password && (
                  <HelperText type="error">{errors.password}</HelperText>
                )}
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
});

export default StepTwo;
