import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button } from 'react-native-paper';

const SignIn: React.FC = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Button
        icon="camera"
        accessibilityStates="Register"
        onPress={() => navigation.navigate('SignUp')}>
        Register
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default SignIn;
