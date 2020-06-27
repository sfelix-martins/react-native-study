import React, { createContext, useContext, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Portal } from 'react-native-paper';

interface GlobalLoaderContextData {
  openGlobalLoader(): void;
  closeGlobalLoader(): void;
}

const GlobalLoaderContext = createContext<GlobalLoaderContextData>(
  {} as GlobalLoaderContextData,
);

const GlobalLoaderProvider: React.FC = ({ children }) => {
  const [opened, setOpened] = useState(false);

  function open() {
    setOpened(true);
  }

  function close() {
    setOpened(false);
  }
  return (
    <GlobalLoaderContext.Provider
      value={{ openGlobalLoader: open, closeGlobalLoader: close }}>
      {opened && (
        <Portal>
          <View style={styles.container}>
            <ActivityIndicator size="large" accessibilityStates />
          </View>
        </Portal>
      )}
      {children}
    </GlobalLoaderContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    opacity: 0.5,
    backgroundColor: '#000',
  },
});

export default GlobalLoaderProvider;

export function useGlobalLoader() {
  return useContext(GlobalLoaderContext);
}
