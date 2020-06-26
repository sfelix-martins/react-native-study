import React, { createContext, useContext, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Button, Dialog, Portal, Subheading } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface ToastOptions {
  type: 'success' | 'error' | 'alert';
  message: string;
  title?: string;
}

interface ToastContextData {
  openDialog(options: ToastOptions): void;
}

const DialogContext = createContext<ToastContextData>({} as ToastContextData);

const ToastProvider: React.FC = ({ children }) => {
  const [opened, setOpened] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [icon, setIcon] = useState<string | null>(null);

  function openDialog(options: ToastOptions) {
    setMessage(options.message);
    setTitle(options.title ?? '');
    setOpened(true);

    const iconTypeMapping = {
      error: 'alert-circle',
      success: 'check',
      alert: 'alert',
    };
    setIcon(iconTypeMapping[options.type]);
  }

  return (
    <DialogContext.Provider value={{ openDialog }}>
      <Portal>
        <Dialog visible={opened}>
          <Dialog.Title accessibilityStates>{title}</Dialog.Title>
          <Dialog.Content style={styles.content}>
            <Icon name={icon} size={50} color="#fff" />
            <Subheading>{message}</Subheading>
          </Dialog.Content>
          <Dialog.Actions>
            <Button accessibilityStates onPress={() => setOpened(false)}>
              OK
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      {children}
    </DialogContext.Provider>
  );
};

const styles = StyleSheet.create({
  content: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ToastProvider;

export function useToast() {
  return useContext(DialogContext);
}
