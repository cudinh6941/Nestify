import { Colors } from "@/constants/Colors";
import { Box, Center, Text } from "native-base";
import { TouchableOpacity } from "react-native";

interface ButtonProps {
  title: string;
  onPress: () => void;
  bgColor?: string;
  textColor?: string;
  borderRadius?: number;
  height?: number | string;
  fontSize?: number;
  fontWeight?: string;
  isLoading?: boolean;
  isDisabled?: boolean;
}
const HomeMateButton: React.FC<ButtonProps> = ({
  title,
  onPress,
  bgColor = "#6200ee",
  textColor = "#ffffff",
  borderRadius = 8,
  height = 50,
  fontSize = 16,
  fontWeight = "bold",
  isLoading = false,
  isDisabled = false,
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Box
        bg={Colors.light.primary}
        borderRadius={borderRadius}
        height={height}
        width="100%"
        opacity={isDisabled ? 0.5 : 1}
        justifyContent="center"
        alignItems="center"
      >
        <Center>
          <Text color="white" fontSize="lg" fontWeight="bold">
            {title}
          </Text>
        </Center>
      </Box>
    </TouchableOpacity>
  );
};
export default HomeMateButton;
