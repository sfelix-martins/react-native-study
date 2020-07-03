import React, { useRef } from 'react';
import {
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Animated,
  ScrollView,
  View,
  StyleSheet,
  Keyboard,
  Easing,
  ViewProperties,
} from 'react-native';
import { Appbar, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ContainedButton from '../../ContainedButton';
import { hasNotch } from 'react-native-device-info';

interface StepperContainerProps extends ViewProperties {
  onNext(): void;
}

const Container: React.FC<StepperContainerProps> = ({ onNext, children }) => {
  const navigation = useNavigation();

  const { colors } = useTheme();
  const paddingAnimation = useRef(new Animated.Value(hasNotch() ? 44 : 0))
    .current;

  Keyboard.addListener('keyboardWillHide', () => {
    if (hasNotch()) {
      Animated.timing(paddingAnimation, {
        toValue: 44,
        duration: 250,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start();
    }
  });
  Keyboard.addListener('keyboardWillShow', () => {
    if (hasNotch()) {
      Animated.timing(paddingAnimation, {
        toValue: 0,
        duration: 250,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start();
    }
  });

  return (
    <>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
      <Appbar.Header
        style={{ backgroundColor: colors.primary }}
        accessibilityStates>
        <Appbar.BackAction accessibilityStates onPress={navigation.goBack} />
      </Appbar.Header>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}>
        <Animated.View
          style={[
            styles.animatedView,
            {
              // Animation for fake SafeAreaView paddingBottom
              paddingBottom: paddingAnimation,
            },
          ]}>
          <SafeAreaView style={styles.safeAreaView}>
            <ScrollView style={styles.scrollView}>{children}</ScrollView>
            <View
              style={[
                styles.buttonContainer,
                { backgroundColor: colors.background },
              ]}>
              <ContainedButton onPress={onNext}>Next</ContainedButton>
            </View>
          </SafeAreaView>
        </Animated.View>
      </KeyboardAvoidingView>
    </>
  );
};

const styles = StyleSheet.create({
  logo: {
    marginBottom: 16,
  },
  textInput: {
    width: '100%',
  },
  animatedView: {
    flex: 1,
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
  safeAreaView: {
    flex: 1,
    // Remove safe area view bottom length to use from aninated view.
    paddingBottom: -44,
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

    shadowOpacity: 0.1,
  },
});

export default Container;
