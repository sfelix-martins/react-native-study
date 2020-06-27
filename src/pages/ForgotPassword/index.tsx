import { Formik } from 'formik';
import React, { useRef } from 'react';
import {
  StyleSheet,
  TextInput as TextInputProps,
  View,
  StatusBar,
} from 'react-native';
import { HelperText, TextInput } from 'react-native-paper';
import * as Yup from 'yup';
import { useTheme } from '@react-navigation/native';
import ContainedButton from '../../components/Forms/ContainedButton';

interface ForgotPasswordValues {
  email: string;
}

const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('The email is required'),
});

const ForgotPassword: React.FC = () => {
  const { colors } = useTheme();
  const passwordRef = useRef<TextInputProps>(null);

  const intialValues: ForgotPasswordValues = { email: '' };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <Formik
        initialValues={intialValues}
        validationSchema={ForgotPasswordSchema}
        onSubmit={(values) => console.log('values', values)}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <View style={styles.container}>
            <TextInput
              style={styles.fill}
              error={!!errors.email && touched.email}
              value={values.email}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              keyboardAppearance="dark"
              returnKeyType="next"
              autoCorrect={false}
              autoCapitalize="none"
              keyboardType="email-address"
              mode="outlined"
              accessibilityStates
              label="E-mail"
              onSubmitEditing={() => passwordRef.current?.focus()}
            />
            {touched.email && errors.email && (
              <HelperText type="error">{errors.email}</HelperText>
            )}

            <ContainedButton style={styles.button} onPress={handleSubmit}>
              Reset password
            </ContainedButton>
          </View>
        )}
      </Formik>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  fill: {
    width: '100%',
  },
  button: {
    marginTop: 16,
    marginBottom: 16,
  },
});

export default ForgotPassword;
