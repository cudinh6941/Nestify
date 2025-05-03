import React from "react";
import {
  Box,
  HStack,
  VStack,
  Text,
  Icon,
  IconButton,
  Divider,
  Pressable,
} from "native-base";
import {
  MaterialIcons,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { CATEGORIES, CategoryItem } from "@/Utils/categoryUtils";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AddStackParamList } from "@/constants/common";

const AddMenu: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<AddStackParamList>>();
  const getCategoryScreenName = (
    categoryId: string
  ): keyof AddStackParamList => {
    switch (categoryId) {
      case "pet":
        return "AddPetScreen";
      case "furniture":
        return "AddHouseHold";
      default:
        return "AddPetScreen"; // Fallback to AddItem
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    const screenName = getCategoryScreenName(categoryId);
    navigation.replace(screenName);
  };

  // Render icon cho mỗi danh mục
  const renderIcon = (category: CategoryItem) => {
    switch (category.iconType) {
      case "MaterialIcons":
        return (
          <Icon
            as={MaterialIcons}
            name={category.iconName}
            color={category.color}
            size="lg"
          />
        );
      case "FontAwesome5":
        return (
          <Icon
            as={FontAwesome5}
            name={category.iconName}
            color={category.color}
            size="lg"
          />
        );
      case "MaterialCommunityIcons":
        return (
          <Icon
            as={MaterialCommunityIcons}
            name={category.iconName}
            color={category.color}
            size="lg"
          />
        );
      default:
        return null;
    }
  };

  return (
    <Box px={2} pt={2} flex={1} bg="white">
      <HStack justifyContent="flex-end" mb={4}>
        <IconButton
          icon={
            <Icon as={MaterialIcons} name="close" size="sm" color="gray.500" />
          }
          borderRadius="full"
          _pressed={{ bg: "gray.100" }}
          onPress={() => navigation.goBack()}
        />
      </HStack>

      <VStack space={3}>
        {CATEGORIES.map((category) => (
          <Pressable
            key={category.id}
            onPress={() => handleCategorySelect(category.id)}
          >
            <Box
              flexDirection="row"
              alignItems="center"
              p={3}
              bg="white"
              borderRadius="xl"
              borderWidth={1}
              borderColor="gray.100"
              shadow={1}
            >
              <Box bg={`${category.color}10`} p={3} borderRadius="full">
                {renderIcon(category)}
              </Box>
              <VStack flex={1} ml={3}>
                <Text fontWeight="semibold" fontSize="md">
                  {category.title}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  {category.description}
                </Text>
              </VStack>
              <Icon
                as={MaterialIcons}
                name="chevron-right"
                size="sm"
                color="gray.400"
              />
            </Box>
          </Pressable>
        ))}
      </VStack>

      <Divider my={4} />

      <Pressable onPress={() => handleCategorySelect("custom")}>
        <Box
          flexDirection="row"
          alignItems="center"
          p={3}
          bg="white"
          borderRadius="xl"
          borderWidth={2}
          borderColor="#673AB7"
          borderStyle="dashed"
        >
          <Box bg="#673AB710" p={3} borderRadius="full">
            <Icon as={MaterialIcons} name="add-box" size="lg" color="#673AB7" />
          </Box>
          <VStack flex={1} ml={3}>
            <Text fontWeight="semibold" fontSize="md">
              Tạo mục mới
            </Text>
            <Text fontSize="sm" color="gray.500">
              Thêm danh mục tùy chỉnh
            </Text>
          </VStack>
          <Box bg="#673AB710" p={1} borderRadius="md">
            <Icon
              as={MaterialCommunityIcons}
              name="rhombus"
              size="sm"
              color="#673AB7"
            />
          </Box>
        </Box>
      </Pressable>
    </Box>
  );
};

export default AddMenu;
