import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
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

interface RadioOption {
  label: string;
  value: string;
}

interface FormRadioGroupProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  options: RadioOption[];
  error?: FieldError;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  radioContainerStyle?: StyleProp<ViewStyle>;
  errorStyle?: StyleProp<TextStyle>;
  testID?: string;
}

function FormRadioGroup<T extends FieldValues>({
  name,
  control,
  label,
  options,
  error,
  containerStyle,
  labelStyle,
  radioContainerStyle,
  errorStyle,
  testID,
}: FormRadioGroupProps<T>) {
  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[styles.label, labelStyle]}>{label}</Text>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => (
          <View
            style={[styles.radioContainer, radioContainerStyle]}
            testID={testID}
          >
            {options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.radioOption,
                  value === option.value && styles.radioOptionSelected,
                  error && styles.radioOptionError,
                ]}
                onPress={() => onChange(option.value)}
                activeOpacity={0.7}
              >
                <View style={styles.radioCircle}>
                  {value === option.value && (
                    <View style={styles.radioSelected} />
                  )}
                </View>
                <Text
                  style={[
                    styles.radioText,
                    value === option.value && styles.radioTextSelected,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
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
  radioContainer: {
    gap: 8,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  radioOptionSelected: {
    backgroundColor: '#E8F5E8',
    borderColor: '#4CAF50',
  },
  radioOptionError: {
    borderColor: '#FF6B6B',
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#CCC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  radioSelected: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#4CAF50',
  },
  radioText: {
    fontSize: 16,
    color: '#555',
    flex: 1,
  },
  radioTextSelected: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 12,
    marginTop: 4,
  },
});

export default FormRadioGroup;
