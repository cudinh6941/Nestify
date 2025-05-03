import React, { useState, useRef, useEffect } from "react";
import {
  FormControl,
  Box,
  Text,
  Icon,
  Pressable,
  HStack,
  Divider,
  ScrollView,
} from "native-base";
import { Ionicons } from "@expo/vector-icons";
import {
  Animated,
  Easing,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";

interface Option {
  label: string;
  value: string;
}

interface CustomDropdownProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  isInvalid?: boolean;
  errorMessage?: string;
  isRequired?: boolean;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  label,
  value,
  onValueChange,
  options,
  placeholder = "Chọn một mục",
  isInvalid = false,
  errorMessage = "",
  isRequired = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const animatedOpacity = useRef(new Animated.Value(0)).current;
  const dropdownRef = useRef(null);
  const selectedOption = options.find((option) => option.value === value);

  // Xử lý animation khi mở/đóng dropdown
  useEffect(() => {
    const toValue = isOpen ? 1 : 0;

    Animated.timing(animatedOpacity, {
      toValue,
      duration: 200,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      useNativeDriver: false,
    }).start();

    if (isOpen) {
      Keyboard.dismiss();
    }
  }, [isOpen]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  const onItemPress = (item: Option) => {
    onValueChange(item.value);
    closeDropdown();
  };

  return (
    <FormControl
      isInvalid={isInvalid}
      isRequired={isRequired}
      zIndex={isOpen ? 999 : 1}
    >
      <FormControl.Label
        _text={{
          fontWeight: "bold",
          color: "#444",
        }}
      >
        {label}
      </FormControl.Label>

      <Box position="relative" ref={dropdownRef}>
        {isOpen && (
          <TouchableWithoutFeedback onPress={closeDropdown}>
            <Pressable
              position="fixed"
              top={0}
              left={0}
              right={0}
              bottom={0}
              bg="transparent"
              zIndex={900}
              style={{
                position: "absolute",
                top: -100,
                left: -100,
                right: -100,
                bottom: -100,
                width: "200%",
                height: "200%",
              }}
            />
          </TouchableWithoutFeedback>
        )}

        {/* Nút chính để mở dropdown */}
        <Pressable
          bg="#f9f9f9"
          borderRadius="lg"
          borderWidth={1}
          borderColor={isInvalid ? "red.500" : "#e0e0e0"}
          height={50}
          justifyContent="center"
          px={3}
          onPress={toggleDropdown}
          zIndex={1001}
        >
          <HStack alignItems="center" justifyContent="space-between">
            <Text fontSize="md" color={selectedOption ? "#333" : "#999"}>
              {selectedOption ? selectedOption.label : placeholder}
            </Text>
            <Icon
              as={Ionicons}
              name={isOpen ? "chevron-up" : "chevron-down"}
              size="sm"
              color="#666"
            />
          </HStack>
        </Pressable>

        {/* Dropdown list */}
        {isOpen && (
          <Animated.View
            style={{
              position: "absolute",
              top: 50,
              left: 0,
              right: 0,
              opacity: animatedOpacity,
              transform: [
                {
                  translateY: animatedOpacity.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-10, 0],
                  }),
                },
              ],
              zIndex: 1000,
            }}
          >
            <Box
              bg="white"
              borderWidth={1}
              borderColor="#e0e0e0"
              borderRadius="lg"
              shadow={3}
              mt={1}
              overflow="hidden"
              maxH={200}
            >
              <ScrollView>
                {options.map((item, index) => (
                  <React.Fragment key={item.value}>
                    <Pressable
                      p={3}
                      bg="white"
                      _pressed={{ bg: "#f0f0f0" }}
                      onPress={() => onItemPress(item)}
                    >
                      <HStack
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Text fontSize="md" color="#333">
                          {item.label}
                        </Text>
                        {item.value === value && (
                          <Icon
                            as={Ionicons}
                            name="checkmark"
                            size="sm"
                            color="#4CAF50"
                          />
                        )}
                      </HStack>
                    </Pressable>
                    {index < options.length - 1 && <Divider bg="#f0f0f0" />}
                  </React.Fragment>
                ))}
              </ScrollView>
            </Box>
          </Animated.View>
        )}
      </Box>

      <FormControl.ErrorMessage>{errorMessage}</FormControl.ErrorMessage>
    </FormControl>
  );
};

export default CustomDropdown;
