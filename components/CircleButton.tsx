import React from "react";
import { TouchableOpacity } from "react-native";
import { Box, Icon } from "native-base";
import FontAwesome from "react-native-vector-icons/FontAwesome";

interface CircleButtonProps {
  iconName: string;
  bgColor: string;
  onPress: () => void;
}

const CircleButton: React.FC<CircleButtonProps> = ({
  iconName,
  bgColor,
  onPress,
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Box
        w={60}
        h={60}
        borderRadius="full"
        backgroundColor={bgColor}
        justifyContent="center"
        alignItems="center"
        shadow={2}
      >
        <Icon as={FontAwesome} name={iconName} size={30} color="white" />
      </Box>
    </TouchableOpacity>
  );
};

export default CircleButton;
