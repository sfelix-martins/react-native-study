import React from 'react';
import { StatusBar, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from 'react-native-paper';

const Container: React.FC = ({ children }) => {
  const { colors } = useTheme();

  return (
    <>
      {/* <SafeAreaView style={styles.flex}> */}
      {/* <StatusBar barStyle="light-content" backgroundColor={colors.primary} /> */}
      {/* <ScrollView
        contentContainerStyle={styles.flex}
        keyboardShouldPersistTaps="handled"> */}
      {children}
      {/* </ScrollView> */}
      {/* </SafeAreaView> */}
    </>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    color: 'red',
  },
});

export default Container;
