import { Box, Center, HStack, VStack, Text } from "native-base";
import { TouchableOpacity } from "react-native";

interface CardOverviewProps {
  quantity: number;
  type: NotificationType;
  title: string;
  height?: number | string;
  width?: number | string;
  icon: React.ReactNode;
  onPress?: () => void;
}
export type NotificationType = "today" | "attention" | "deadline";
export const CardOverview: React.FC<CardOverviewProps> = ({
  quantity,
  type,
  height,
  width,
  icon,
  title,
  onPress,
}) => {
  const getCardColor = (): string => {
    switch (type) {
      case "today":
        return "#4CAF50";
      case "attention":
        return "#FF9800";
      case "deadline":
        return "#F44336";
      default:
        return "#4CAF50";
    }
  };
  const getDefaultIcon = (): string => {
    switch (type) {
      case "today":
        return "📋";
      case "attention":
        return "⚠️";
      case "deadline":
        return "⏰";
      default:
        return "📋";
    }
  };
  const backgroundColor = getCardColor();
  const defaultIcon = getDefaultIcon();

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
      <Box
        bg={backgroundColor}
        width={width}
        height={height}
        borderRadius="lg"
        shadow={3}
        p={4}
      >
        <VStack>
          <HStack>
            <Center bg="rgba(255,255,255,0.3)" p={1} borderRadius="full">
              {icon || <Text fontSize="lg">{defaultIcon}</Text>}
            </Center>
            <Text color="white" fontWeight="medium" fontSize="sm">
              {title}
            </Text>
          </HStack>
          <Center flex={1}>
            <Text color="white" fontWeight="bold" fontSize="5xl">
              {quantity}
            </Text>
          </Center>
        </VStack>
      </Box>
    </TouchableOpacity>
  );
};
