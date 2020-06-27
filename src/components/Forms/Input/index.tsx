import React, { forwardRef, useRef, useImperativeHandle } from 'react';
import { StyleSheet } from 'react-native';
import { HelperText, TextInput, Theme } from 'react-native-paper';
import { TextInputProps } from 'react-native-paper/lib/typescript/src/components/TextInput/TextInput';

interface InputProps extends Omit<TextInputProps, 'theme'> {
  errorMessage: string | undefined;
  touched: boolean | undefined;
  theme?: Theme;
}

interface InputRef {
  focus(): void;
  blur(): void;
}

/**
 *
 * @todo Check forward ref for onBlur and onChangeText inputs
 * @param param0
 * @param ref
 */
const Input: React.RefForwardingComponent<InputRef, InputProps> = (
  { errorMessage, touched, style, ...rest },
  ref,
) => {
  const inputElementRef = useRef<any>(null);

  useImperativeHandle(ref, () => ({
    focus() {
      inputElementRef.current.focus();
    },
    blur() {
      inputElementRef.current.blur();
    },
  }));

  return (
    <>
      <TextInput
        {...rest}
        ref={inputElementRef}
        style={[styles.input, style]}
        error={!!errorMessage && touched}
        mode="outlined"
        accessibilityStates
      />
      {errorMessage && touched && (
        <HelperText type="error">{errorMessage}</HelperText>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  input: {
    width: '100%',
  },
});

export default forwardRef(Input);
