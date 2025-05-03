import React, { useState, useRef, RefObject, useEffect } from "react";
import {
  Box,
  ScrollView,
  VStack,
  HStack,
  KeyboardAvoidingView,
  Text,
} from "native-base";
import { Keyboard, Platform, TouchableWithoutFeedback } from "react-native";
import HomeMateButton from "@/components/Button";
import CustomTextfield from "@/components/CustomTextfield";
import CustomDatePicker from "@/components/DatePicker";
import CustomDropdown from "@/components/Dropdown";
import ImagePicker from "@/components/ImagePicker";
import ImagePickerSheet from "@/components/ImagePickerSheet";

// Định nghĩa enum cho các loại field
export enum FieldType {
  TEXT = "text",
  NUMBER = "number",
  DATE = "date",
  DROPDOWN = "dropdown",
  IMAGE = "image",
  TEXTAREA = "textarea",
}

// Interface cho options của dropdown
export interface DropdownOption {
  label: string;
  value: string;
}

// Interface chung cho tất cả các loại field
export interface BaseFieldConfig {
  name: string;
  type: FieldType;
  label: string;
  required?: boolean;
  width?: string;
  startNewRow?: boolean;
}

// Interface cho field text
export interface TextFieldConfig extends BaseFieldConfig {
  type: FieldType.TEXT;
  placeholder?: string;
  keyboardType?: "default" | "email-address" | "phone-pad" | "numeric";
}

// Interface cho field number
export interface NumberFieldConfig extends BaseFieldConfig {
  type: FieldType.NUMBER;
  placeholder?: string;
  keyboardType?: "numeric" | "phone-pad";
}

// Interface cho field date
export interface DateFieldConfig extends BaseFieldConfig {
  type: FieldType.DATE;
}

// Interface cho field dropdown
export interface DropdownFieldConfig extends BaseFieldConfig {
  type: FieldType.DROPDOWN;
  options: DropdownOption[];
}

// Interface cho field image
export interface ImageFieldConfig extends BaseFieldConfig {
  type: FieldType.IMAGE;
}

// Interface cho field textarea
export interface TextAreaFieldConfig extends BaseFieldConfig {
  type: FieldType.TEXTAREA;
  placeholder?: string;
  numberOfLines?: number;
}

// Union type cho tất cả các loại field
export type FieldConfig =
  | TextFieldConfig
  | NumberFieldConfig
  | DateFieldConfig
  | DropdownFieldConfig
  | ImageFieldConfig
  | TextAreaFieldConfig;

// Interface cho form config
export interface FormConfig {
  title?: string;
  saveButtonTitle?: string;
  onSave?: (formData: Record<string, any>) => void;
  fields: FieldConfig[];
}

// Props cho component DynamicForm
interface DynamicFormProps {
  formConfig: FormConfig;
  externalFormData?: Record<string, any>; // Dữ liệu form từ bên ngoài (tùy chọn)
  onFieldChange?: (
    name: string,
    value: any,
    formData: Record<string, any>
  ) => void; // Callback khi giá trị field thay đổi
}

// Interface cho ImagePicker ref
interface ImagePickerRef {
  handleImageSelect: (source: "camera" | "library") => Promise<void>;
}

const DynamicForm: React.FC<DynamicFormProps> = ({
  formConfig,
  externalFormData,
  onFieldChange,
}) => {
  const { title, saveButtonTitle = "Lưu", onSave, fields = [] } = formConfig;

  // State để lưu trữ dữ liệu form
  const [formData, setFormData] = useState<Record<string, any>>(
    externalFormData || {}
  );
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState<boolean>(false);
  const imagePickerRef = useRef<ImagePickerRef | null>(null);

  // State để track field đang được chọn (cho image picker)
  const [currentImageField, setCurrentImageField] = useState<string>("");

  // Xử lý thay đổi giá trị của field

  useEffect(() => {
    if (externalFormData) {
      setFormData(externalFormData);
    }
  }, [externalFormData]);

  const handleValueChange = (name: string, value: any): void => {
    setFormData((prev) => {
      const newFormData = { ...prev, [name]: value };

      // Gọi callback onFieldChange nếu được cung cấp
      if (onFieldChange) {
        onFieldChange(name, value, newFormData);
      }

      return newFormData;
    });
  };

  // Xử lý khi chọn nguồn ảnh
  const handleSelectImageSource = async (
    source: "camera" | "library"
  ): Promise<void> => {
    if (imagePickerRef.current) {
      await imagePickerRef.current.handleImageSelect(source);
    }
    setIsBottomSheetOpen(false);
  };

  // Xử lý khi nhấn vào image picker
  const handleImagePickerPress = (fieldName: string): void => {
    setCurrentImageField(fieldName);
    setIsBottomSheetOpen(true);
  };

  // Xử lý lưu form
  const handleSaveForm = (): void => {
    if (onSave) {
      onSave(formData);
    }
  };

  // Render field dựa vào type
  const renderField = (
    field: FieldConfig,
    index: number
  ): JSX.Element | null => {
    const { name, label, required, width = "100%" } = field;

    switch (field.type) {
      case FieldType.TEXT:
        return (
          <Box key={`${name}-${index}`} width={width}>
            <CustomTextfield
              label={label}
              value={formData[name] || ""}
              placeholder={field.placeholder}
              onChangeText={(text: string) => handleValueChange(name, text)}
              isRequired={required}
              keyboardType={field.keyboardType}
            />
          </Box>
        );

      case FieldType.NUMBER:
        return (
          <Box key={`${name}-${index}`} width={width}>
            <CustomTextfield
              label={label}
              value={
                formData[name] !== undefined ? formData[name].toString() : ""
              }
              placeholder={field.placeholder}
              onChangeText={(text: string) => {
                const normalized = text.replace(",", ".");
                const parsed = parseFloat(normalized);
                if (!isNaN(parsed)) {
                  handleValueChange(name, parsed);
                } else if (text === "") {
                  handleValueChange(name, undefined);
                }
              }}
              isRequired={required}
              keyboardType={field.keyboardType || "numeric"}
            />
          </Box>
        );

      case FieldType.DATE:
        return (
          <Box key={`${name}-${index}`} width={width}>
            <CustomDatePicker
              label={label}
              date={formData[name] || new Date()}
              onDateChange={(date: Date) => handleValueChange(name, date)}
              isRequired={required}
            />
          </Box>
        );

      // Trong DynamicForm.tsx
      case FieldType.DROPDOWN:
        return (
          <Box key={`${name}-${index}`} width={width} position="relative">
            <CustomDropdown
              label={label}
              value={formData[name] || ""}
              options={field.options || []}
              onValueChange={(value: string) => handleValueChange(name, value)}
              isRequired={required}
            />
          </Box>
        );

      case FieldType.TEXTAREA:
        return (
          <Box key={`${name}-${index}`} width={width}>
            <CustomTextfield
              label={label}
              value={formData[name] || ""}
              placeholder={field.placeholder}
              onChangeText={(text: string) => handleValueChange(name, text)}
              isRequired={required}
            />
          </Box>
        );

      case FieldType.IMAGE:
        return (
          <Box key={`${name}-${index}`} width={width} alignItems="center">
            <ImagePicker
              ref={name === currentImageField ? imagePickerRef : null}
              imageUri={formData[name]}
              onPress={() => handleImagePickerPress(name)}
              onImageSelected={(uri: string) => handleValueChange(name, uri)}
            />
            {label && (
              <Text mt={2} color="gray.500">
                {label}
              </Text>
            )}
          </Box>
        );

      default:
        return null;
    }
  };

  // Sắp xếp các field thành các hàng
  const renderRows = (): JSX.Element[] => {
    let rows: JSX.Element[] = [];
    let currentRow: JSX.Element[] = [];
    let currentRowWidth = 0;

    fields.forEach((field, index) => {
      const widthString = field.width || "100%";
      const width = parseFloat(widthString) / 100;

      if (field.startNewRow || currentRowWidth + width > 1) {
        // Bắt đầu hàng mới
        if (currentRow.length > 0) {
          rows.push(
            <HStack
              key={`row-${rows.length}`}
              space={3}
              justifyContent="space-between"
              zIndex={fields.length - rows.length}
            >
              {currentRow}
            </HStack>
          );
          currentRow = [];
          currentRowWidth = 0;
        }
      }

      const renderedField = renderField(field, index);
      if (renderedField) {
        currentRow.push(renderedField);
        currentRowWidth += width;
      }

      // Nếu là field cuối cùng, thêm hàng hiện tại vào danh sách hàng
      if (index === fields.length - 1 && currentRow.length > 0) {
        rows.push(
          <HStack
            key={`row-${rows.length}`}
            space={3}
            justifyContent="space-between"
            zIndex={fields.length - rows.length}
          >
            {currentRow}
          </HStack>
        );
      }
    });

    return rows;
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 120 : 0}
    >
      <Box backgroundColor="gray.100" flex={1} px={4}>
        <ScrollView
          py={4}
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={true}
          scrollEnabled={true}
          nestedScrollEnabled={true}
          keyboardShouldPersistTaps="handled"
          zIndex={1}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <Box backgroundColor="white" flex={1} borderRadius="lg" p={4}>
              {title && (
                <Text fontSize="xl" fontWeight="bold" mb={4}>
                  {title}
                </Text>
              )}
              <VStack space={4}>
                {renderRows()}
                <HomeMateButton
                  title={saveButtonTitle}
                  onPress={handleSaveForm}
                />
              </VStack>
            </Box>
          </TouchableWithoutFeedback>
        </ScrollView>
        <ImagePickerSheet
          isOpen={isBottomSheetOpen}
          onClose={() => setIsBottomSheetOpen(false)}
          onSelect={handleSelectImageSource}
        />
      </Box>
    </KeyboardAvoidingView>
  );
};

export default DynamicForm;
