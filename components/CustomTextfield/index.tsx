import React from "react";
import { TextInput, Platform, StyleSheet } from "react-native";
import { FormControl } from "native-base";

interface CustomTextfieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  onFocus?: () => void;
  placeholder?: string;
  isInValid?: boolean;
  errorMessage?: string;
  isRequired?: boolean;
  keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
}

const CustomTextfield: React.FC<CustomTextfieldProps> = ({
  label,
  value,
  onChangeText,
  onFocus,
  placeholder = "",
  isInValid = false,
  errorMessage = "",
  keyboardType = "default",
  isRequired = false,
}) => {
  return (
    <FormControl isInvalid={isInValid} isRequired={isRequired}>
      <FormControl.Label
        _text={{
          fontWeight: "bold",
          color: "#444",
        }}
      >
        {label}
      </FormControl.Label>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onFocus={onFocus}
        placeholder={placeholder}
        style={{
          height: 50,
          paddingHorizontal: 16,
          paddingVertical: Platform.OS === "ios" ? 12 : 8,
          fontSize: 14,
          backgroundColor: "#f9f9f9",
          borderRadius: 8,
          borderWidth: 1,
          borderColor: isInValid ? "#f56565" : "#e0e0e0",
          color: "#1f2937",
        }}
        placeholderTextColor="#a0a0a0"
        keyboardType={keyboardType}
        autoComplete="off"
        autoCorrect={false}
        returnKeyType="done"
      />
      <FormControl.ErrorMessage>{errorMessage}</FormControl.ErrorMessage>
    </FormControl>
  );
};

export default CustomTextfield;
