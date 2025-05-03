import React from "react";
import { Box, Text, Center, HStack, VStack } from "native-base";
import { TouchableOpacity } from "react-native";

export type CategoryType = "furniture" | "pet" | "plant" | "expense";

interface ItemCategoryProps {
  type: CategoryType;
  title: string;
  count: number;
  countLabel?: string;
  icon?: React.ReactNode;
  onPress?: () => void;
}

export const ItemCategory: React.FC<ItemCategoryProps> = ({
  type,
  title,
  count,
  countLabel,
  icon,
  onPress,
}) => {
  const getCategoryStyles = () => {
    switch (type) {
      case "furniture":
        return {
          bgColor: "#FFF0F0",
          iconBgColor: "#FFCDD2",
          defaultLabel: "vật phẩm",
        };
      case "pet":
        return {
          bgColor: "#E3F2FD",
          iconBgColor: "#BBDEFB",
          defaultLabel: "thú cưng",
        };
      case "plant":
        return {
          bgColor: "#E8F5E9",
          iconBgColor: "#C8E6C9",
          defaultLabel: "cây",
        };
      case "expense":
        return {
          bgColor: "#FFF8E1",
          iconBgColor: "#FFECB3",
          defaultLabel: "khoản",
        };
      default:
        return {
          bgColor: "#F5F5F5",
          iconBgColor: "#E0E0E0",
          defaultLabel: "mục",
        };
    }
  };

  const { bgColor, iconBgColor, defaultLabel } = getCategoryStyles();
  const itemLabel = countLabel || defaultLabel;

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
      <Box
        bg={bgColor}
        p={4}
        borderRadius="lg"
        width={160}
        height={150}
        shadow={1}
      >
        <VStack space={4}>
          <Center bg={iconBgColor} size="50px" borderRadius="full">
            {icon}
          </Center>

          <VStack space={1}>
            <Text fontSize="lg" fontWeight="bold">
              {title}
            </Text>

            <Text color="gray.600" fontSize="sm">
              {count} {itemLabel}
            </Text>
          </VStack>
        </VStack>
      </Box>
    </TouchableOpacity>
  );
};
