import { formatDate } from "@/Utils/formatUtils";
import { Ionicons } from "@expo/vector-icons";
import {
  Box,
  FormControl,
  Icon,
  Text,
  Modal,
  Button,
  Center,
} from "native-base";
import { useState } from "react";
import { Platform, Pressable, StyleSheet } from "react-native";
import RNDateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";

interface CustomDatePickerProps {
  label: string;
  date: Date;
  onDateChange: (date: Date) => void;
  iconColor?: string;
  iconBgColor?: string;
  isRequired?: boolean;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  label,
  date,
  onDateChange,
  iconColor = "#ff5252",
  iconBgColor = "#ffe0e0",
  isRequired = false,
}) => {
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [tempDate, setTempDate] = useState(date);
  const [dateSelected, setDateSelected] = useState(date);
  const handleIOSDateChange = (_: any, selectedDate?: Date) => {
    if (selectedDate) {
      setTempDate(selectedDate);
    }
  };

  const handleConfirm = () => {
    setDateSelected(tempDate);
    onDateChange(tempDate);
    setShowIOSModal(false);
  };

  const openDatePicker = () => {
    if (Platform.OS === "android") {
      DateTimePickerAndroid.open({
        value: date,
        onChange: (_, selectedDate) => {
          if (selectedDate) {
            onDateChange(selectedDate);
          }
        },
        mode: "date",
      });
    } else {
      setTempDate(date);
      setShowIOSModal(true);
    }
  };

  return (
    <FormControl isRequired={isRequired} flex={1}>
      <FormControl.Label _text={{ fontWeight: "bold", color: "#444" }}>
        {label}
      </FormControl.Label>
      <Box
        bg="#f9f9f9"
        borderRadius="lg"
        borderWidth={1}
        borderColor="#e0e0e0"
        height={50}
        justifyContent="space-between"
        flexDirection="row"
        alignItems="center"
        px={3}
      >
        <Pressable onPress={openDatePicker}>
          <Text>{formatDate(dateSelected)}</Text>
        </Pressable>

        <Pressable onPress={openDatePicker}>
          <Box bg={iconBgColor} borderRadius="full" p={1}>
            <Icon as={Ionicons} name="calendar" size="sm" color={iconColor} />
          </Box>
        </Pressable>
      </Box>

      {Platform.OS === "ios" && (
        <Modal isOpen={showIOSModal} onClose={() => setShowIOSModal(false)}>
          <Modal.Content width="90%">
            <Modal.Header>Chọn ngày</Modal.Header>
            <Modal.Body>
              <Center>
                <RNDateTimePicker
                  value={tempDate}
                  mode="date"
                  display="inline"
                  onChange={handleIOSDateChange}
                  themeVariant="light"
                  accentColor={iconColor}
                  textColor="#000"
                />
              </Center>
            </Modal.Body>
            <Modal.Footer>
              <Button.Group space={2}>
                <Button
                  variant="ghost"
                  colorScheme="blueGray"
                  onPress={() => setShowIOSModal(false)}
                >
                  Hủy
                </Button>
                <Button onPress={handleConfirm}>Xác nhận</Button>
              </Button.Group>
            </Modal.Footer>
          </Modal.Content>
        </Modal>
      )}
    </FormControl>
  );
};

export default CustomDatePicker;
