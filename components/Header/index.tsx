import React from "react";
import { Box, Text, HStack, VStack, Center } from "native-base";
import { TouchableOpacity, TextInput, Platform } from "react-native";
interface HomeHeaderProps {
  username?: string;
  greeting?: string;
  avatarInitial?: string;
  temperature?: string;
  location?: string;
  onAvatarPress?: () => void;
  onSearch?: (text: string) => void;
}

const HomeHeader: React.FC<HomeHeaderProps> = ({
  username = "Nguyễn Văn A",
  greeting = "Xin chào,",
  avatarInitial = "A",
  temperature = "28°C",
  location = "Hà Nội",
  onAvatarPress = () => {},
  onSearch = () => {},
}) => {
  return (
    <VStack space={4}>
      {/* Header with greeting and avatar */}
      <HStack justifyContent="space-between" alignItems="center">
        <VStack>
          <Text fontSize="md" color="gray.500">
            {greeting}
          </Text>
          <Text fontWeight="bold" fontSize="2xl">
            {username}
          </Text>
        </VStack>
        <TouchableOpacity onPress={onAvatarPress}>
          <Center bg="#8BC34A" rounded="full" size="40px">
            <Text color="white" fontSize="md" fontWeight="bold">
              {avatarInitial}
            </Text>
          </Center>
        </TouchableOpacity>
      </HStack>

      {/* Weather widget and search bar */}
      <HStack space={2}>
        {/* Weather */}
        <Center
          bg="#E8F5E9"
          px={1}
          py={2}
          borderRadius="lg"
          alignItems="flex-start"
        >
          <Text color="#2E7D32" fontSize="xs">
            ☀️ {temperature} • {location}
          </Text>
        </Center>

        {/* Search bar */}
        <Box
          flex={1}
          borderRadius="full"
          overflow="hidden"
          justifyContent="center"
        >
          <TextInput
            placeholder="🔍 Tìm kiếm..."
            style={{
              paddingHorizontal: 16,
              paddingVertical: Platform.OS === "ios" ? 12 : 8,
              fontSize: 14,
              backgroundColor: "#f5f5f5",
            }}
            placeholderTextColor="#a0a0a0"
            onChangeText={onSearch}
          />
        </Box>
      </HStack>
    </VStack>
  );
};

export default HomeHeader;
