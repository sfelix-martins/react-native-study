import { Formik } from 'formik';
import React, { useRef } from 'react';
import { StyleSheet, TextInput as TextInputProps, View } from 'react-native';
import { HelperText, TextInput } from 'react-native-paper';
import * as Yup from 'yup';

import { useNavigation } from '@react-navigation/native';

import {
  ContainedButton,
  FormContainer,
  StepperContainer,
} from '../../../components/Forms';

interface FormValues {
  firstName: string;
  lastName: string;
}

const FormSchema = Yup.object().shape({
  firstName: Yup.string().required('The first name is required'),
  lastName: Yup.string().required('The last name is required'),
});

const StepOne: React.FC = () => {
  const navigation = useNavigation();

  const lastNameRef = useRef<TextInputProps>(null);

  function nextStep() {
    navigation.navigate('StepTwo');
  }

  const intialValues: FormValues = { firstName: '', lastName: '' };

  return (
    <StepperContainer>
      <FormContainer>
        <Formik
          initialValues={intialValues}
          validationSchema={FormSchema}
          onSubmit={(values) => {
            console.log('values', values);
            nextStep();
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
                  error={!!errors.firstName && touched.firstName}
                  value={values.firstName}
                  onChangeText={handleChange('firstName')}
                  onBlur={handleBlur('firstName')}
                  returnKeyType="next"
                  autoCapitalize="words"
                  mode="outlined"
                  accessibilityStates
                  label="First Name"
                  onSubmitEditing={() => lastNameRef.current?.focus()}
                />
                {touched.firstName && errors.firstName && (
                  <HelperText type="error">{errors.firstName}</HelperText>
                )}

                <TextInput
                  ref={lastNameRef}
                  style={styles.fill}
                  error={!!errors.lastName && touched.lastName}
                  value={values.lastName}
                  onChangeText={handleChange('lastName')}
                  onBlur={handleBlur('lastName')}
                  returnKeyType="send"
                  autoCapitalize="words"
                  mode="outlined"
                  accessibilityStates
                  label="Last Name"
                  onSubmitEditing={handleSubmit}
                />
                {touched.lastName && errors.lastName && (
                  <HelperText type="error">{errors.lastName}</HelperText>
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

export default StepOne;
