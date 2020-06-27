import { Formik } from 'formik';
import React, { useRef } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  TextInput as TextInputProps,
  View,
} from 'react-native';
import { HelperText, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Yup from 'yup';

import { useTheme } from '@react-navigation/native';

import ContainedButton from '../../components/Forms/ContainedButton';
import Logo from '../../components/Logo';

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
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <ScrollView
        contentContainerStyle={{ flex: 1 }}
        keyboardShouldPersistTaps="handled">
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
              <Logo style={styles.logo} />
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
      </ScrollView>
    </SafeAreaView>
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

export default ForgotPassword;
