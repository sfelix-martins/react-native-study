import React, { useRef } from 'react';
import {
  Animated,
  Easing,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
  ViewProperties,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Appbar, useTheme } from 'react-native-paper';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import { useNavigation } from '@react-navigation/native';

import ContainedButton from '../../ContainedButton';

interface StepperContainerProps extends ViewProperties {
  onNext(): void;
}

const Container: React.FC<StepperContainerProps> = ({ onNext, children }) => {
  const navigation = useNavigation();
  const { bottom: safeAreaViewBottomPadding } = useSafeAreaInsets();

  const hasSafeAreaOnBottom = safeAreaViewBottomPadding > 0;

  const { colors } = useTheme();
  const paddingAnimation = useRef(new Animated.Value(safeAreaViewBottomPadding))
    .current;

  if (Platform.OS === 'ios') {
    Keyboard.addListener('keyboardWillHide', () => {
      if (hasSafeAreaOnBottom) {
        Animated.timing(paddingAnimation, {
          toValue: safeAreaViewBottomPadding,
          duration: 250,
          easing: Easing.linear,
          useNativeDriver: false,
        }).start();
      }
    });
    Keyboard.addListener('keyboardWillShow', () => {
      if (hasSafeAreaOnBottom) {
        Animated.timing(paddingAnimation, {
          toValue: 0,
          duration: 250,
          easing: Easing.linear,
          useNativeDriver: false,
        }).start();
      }
    });
  }

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
              backgroundColor: colors.background,
              // Animation for fake SafeAreaView paddingBottom
              paddingBottom: paddingAnimation,
            },
          ]}>
          <SafeAreaView
            style={[
              styles.safeAreaView,
              {
                paddingBottom: -safeAreaViewBottomPadding,
              },
            ]}>
            <ScrollView style={styles.scrollView}>{children}</ScrollView>
            {Platform.OS === 'android' && (
              <LinearGradient
                style={styles.linearGradient}
                colors={[colors.background, '#0000001A']}
              />
            )}
            <View
              style={[
                Platform.OS === 'ios'
                  ? styles.buttonContainerIOS
                  : styles.buttonContainerAndroid,
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
  },

  linearGradient: {
    paddingTop: 8,
    paddingHorizontal: 8,
  },
  buttonContainerIOS: {
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
  buttonContainerAndroid: {
    padding: 16,
  },
});

export default Container;
