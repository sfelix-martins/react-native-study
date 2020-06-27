import 'react-native-gesture-handler';

import React from 'react';
import { StatusBar, SafeAreaView, StyleSheet } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';

import { NavigationContainer, useTheme } from '@react-navigation/native';

import ApolloProvider from './config/apollo';
import { AuthProvider } from './contexts/auth';
import ToastProvider from './contexts/toast';
import Routes from './routes';
import theme from './config/theme';
import GlobalLoaderProvider from './contexts/global-loader';

const App: React.FC = () => {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
  });

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer theme={theme}>
        <GlobalLoaderProvider>
          <ToastProvider>
            <ApolloProvider>
              <AuthProvider>
                <StatusBar />
                <SafeAreaView style={styles.safeArea}>
                  <Routes />
                </SafeAreaView>
              </AuthProvider>
            </ApolloProvider>
          </ToastProvider>
        </GlobalLoaderProvider>
      </NavigationContainer>
    </PaperProvider>
  );
};

export default App;
