import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {
  Controller,
  Control,
  FieldValues,
  Path,
  FieldError,
} from 'react-hook-form';

interface FormInputProps<T extends FieldValues> extends TextInputProps {
  name: Path<T>;
  control: Control<T>;
  label: string;
  error?: FieldError;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  inputStyle?: StyleProp<ViewStyle>;
  errorStyle?: StyleProp<TextStyle>;
  testID?: string;
}

function FormInput<T extends FieldValues>({
  name,
  control,
  label,
  error,
  containerStyle,
  labelStyle,
  inputStyle,
  errorStyle,
  testID,
  ...inputProps
}: FormInputProps<T>) {
  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[styles.label, labelStyle]}>{label}</Text>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[styles.input, inputStyle, error && styles.inputError]}
            onBlur={onBlur}
            onChangeText={onChange}
            value={
              value !== undefined && value !== null ? value.toString() : ''
            }
            testID={testID}
            {...inputProps}
          />
        )}
      />
      {error && (
        <Text style={[styles.errorText, errorStyle]}>{error.message}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#555',
  },
  input: {
    backgroundColor: '#F9F9F9',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 4,
    padding: 10,
  },
  inputError: {
    borderColor: '#FF6B6B',
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 12,
    marginTop: 4,
  },
});

export default FormInput;
