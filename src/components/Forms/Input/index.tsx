import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import {
  TextInputMask,
  TextInputMaskOptionProp,
  TextInputMaskTypeProp,
} from 'react-native-masked-text';
import { HelperText, TextInput, Theme } from 'react-native-paper';
import { TextInputProps as PaperTextInputProps } from 'react-native-paper/lib/typescript/src/components/TextInput/TextInput';

import { useField } from '@unform/core';

interface InputProps extends Omit<PaperTextInputProps, 'theme'> {
  name: string;
  theme?: Theme;
  showErrorMessage?: boolean;
  maskType?: TextInputMaskTypeProp;
  maskOptions?: TextInputMaskOptionProp;
}

interface InputValueReference {
  value: string;
}

interface InputRef {
  focus(): void;
}

const Input: React.RefForwardingComponent<InputRef, InputProps> = (
  {
    name,
    onChangeText,
    maskType,
    maskOptions,
    showErrorMessage = true,
    ...rest
  },
  ref,
) => {
  const inputElementRef = useRef<any>(null);

  const { registerField, defaultValue = '', fieldName, error } = useField(name);
  const inputValueRef = useRef<InputValueReference>({ value: defaultValue });
  let maskedFieldRef: any | null = null;

  useImperativeHandle(ref, () => ({
    focus() {
      inputElementRef.current.focus();
    },
  }));

  useImperativeHandle(ref, () => ({
    focus() {
      if (maskedFieldRef) {
        maskedFieldRef.getElement().focus();
      } else {
        inputElementRef.current.focus();
      }
    },
  }));

  useEffect(() => {
    registerField<string>({
      name: fieldName,
      ref: inputValueRef.current,
      path: 'value',
      setValue(ref: any, value) {
        inputValueRef.current.value = value;
        inputElementRef.current?.setNativeProps({ text: value });
      },
      clearValue() {
        inputValueRef.current.value = '';
        inputElementRef.current?.clear();
      },
    });
  }, [fieldName, registerField]);

  let render;
  if (maskType) {
    render = (props: any) => (
      <TextInputMask
        {...props}
        includeRawValueInChangeText={true}
        type={maskType}
        options={maskOptions}
        ref={(ref) => (maskedFieldRef = ref)}
        onChangeText={(value, raw) => {
          props.onChangeText(raw);
        }}
      />
    );
  }

  return (
    <>
      <TextInput
        error={!!error}
        accessibilityStates
        ref={inputElementRef}
        keyboardAppearance="dark"
        placeholderTextColor="#666360"
        defaultValue={defaultValue}
        render={render}
        onChangeText={(value) => {
          inputValueRef.current.value = value;
          if (onChangeText) {
            onChangeText(value);
          }
        }}
        {...rest}
      />
      {error && showErrorMessage && (
        <HelperText type="error">{error}</HelperText>
      )}
    </>
  );
};

export default forwardRef(Input);
