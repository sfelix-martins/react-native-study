import React, { useCallback, useRef } from 'react';
import {
  Animated,
  Easing,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput as TextInputProps,
  View,
} from 'react-native';
import { hasNotch } from 'react-native-device-info';
import { useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Yup from 'yup';

import { useNavigation } from '@react-navigation/native';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/mobile';

import {
  ContainedButton,
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
  const { colors } = useTheme();
  const paddingAnimation = useRef(new Animated.Value(hasNotch() ? 44 : 0))
    .current;

  Keyboard.addListener('keyboardWillHide', () => {
    if (hasNotch()) {
      Animated.timing(paddingAnimation, {
        toValue: 44,
        duration: 300,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start();
    }
  });
  Keyboard.addListener('keyboardWillShow', () => {
    if (hasNotch()) {
      Animated.timing(paddingAnimation, {
        toValue: 0,
        duration: 300,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start();
    }
  });

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

  const styles = StyleSheet.create({
    logo: {
      marginBottom: 16,
    },
    textInput: {
      width: '100%',
    },

    container: {
      flex: 1,
    },
    scrollView: {
      paddingHorizontal: 16,
    },
    input: {
      marginBottom: 20,
      borderBottomWidth: 2,
      borderColor: '#dbdbdb',
      padding: 10,
    },
    buttonContainer: {
      padding: 16,

      shadowRadius: 5,
      shadowOffset: {
        width: 0,
        height: -6,
      },
      shadowColor: '#000000',
      elevation: 10,

      backgroundColor: colors.background,
      shadowOpacity: 0.1,
    },
  });

  return (
    <StepperContainer>
      {/* <FormContainer> */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}>
        <Animated.View
          style={{
            flex: 1,
            paddingBottom: paddingAnimation,
          }}>
          <SafeAreaView
            style={{
              flex: 1,
              // Remove safe area view bottom length to use from aninated view.
              paddingBottom: -44,
            }}>
            <ScrollView style={styles.scrollView}>
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
                  ref={lastNameRef}
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
            </ScrollView>
            <View style={styles.buttonContainer}>
              <ContainedButton
                onPress={() => {
                  console.log('ok');
                }}>
                Next
              </ContainedButton>
            </View>
          </SafeAreaView>
        </Animated.View>
      </KeyboardAvoidingView>
    </StepperContainer>
  );
};

export default StepOne;
