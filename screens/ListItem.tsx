import React, { useState, useEffect } from "react";
import {
  Box,
  FlatList,
  HStack,
  VStack,
  Text,
  Image,
  Pressable,
  Icon,
  Input,
  IconButton,
  Heading,
  ScrollView,
  Badge,
  Spinner,
  Center,
  StatusBar,
} from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useRealmUtils } from "@/hooks/useReamUtils";
import { Dimensions } from "react-native";
import { formatCurrency } from "@/Utils/formatUtils";
import { FullStackParamList } from "@/components/type/types";
import { ENTITY_TYPES } from "@/constants/common";

// Định nghĩa interface mới cho Entity
interface Entity {
  id: string;
  userId: string;
  categoryId: string;
  name: string;
  attributes: string; // JSON string
  expiryDate?: Date;
  nextServiceDate?: Date;
  nextCareDate?: Date;
  quantity: number;
  location?: string;
  imageUrl?: string;
  status?: string;
  createdAt: Date;
  updatedAt: Date;
}

const HouseholdItemsScreen = () => {
  const [items, setItems] = useState<Entity[]>([]);
  const [filteredItems, setFilteredItems] = useState<Entity[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [loading, setLoading] = useState<boolean>(true);
  const [isGridView, setIsGridView] = useState<boolean>(false);

  const navigation = useNavigation<NavigationProp<FullStackParamList>>();
  const { getAllEntities, getEntitiesByFilter } = useRealmUtils();

  // Danh sách các danh mục
  const categories = [
    { id: "all", name: "Tất cả" },
    { id: "electronic", name: "Đồ điện tử" },
    { id: "furniture", name: "Đồ nội thất" },
    { id: "kitchen", name: "Thiết bị bếp" },
    { id: "clothes", name: "Quần áo" },
    { id: "others", name: "Khác" },
  ];

  // Danh sách các vị trí
  const locations = {
    living_room: "Phòng khách",
    bedroom: "Phòng ngủ",
    kitchen: "Nhà bếp",
    bathroom: "Phòng tắm",
    storage: "Kho",
  };

  // Màu sắc cho từng danh mục
  const categoryColors = {
    electronic: "#FFECE8",
    furniture: "#FFF8E1",
    kitchen: "#E8F5E9",
    clothes: "#F2E5FF",
    others: "#E0F7FA",
  };

  // Màu icon cho từng danh mục
  const categoryIconColors = {
    electronic: "#FF6B57",
    furniture: "#FFC107",
    kitchen: "#4CAF50",
    clothes: "#9B59B6",
    others: "#00BCD4",
  };

  // Icon cho từng danh mục
  const categoryIcons = {
    electronic: "tv",
    furniture: "bed",
    kitchen: "restaurant",
    clothes: "shirt",
    others: "cube",
  };

  // Load dữ liệu khi component được mount
  useEffect(() => {
    loadItems();
  }, []);

  // Áp dụng bộ lọc khi search query hoặc danh mục được chọn thay đổi
  useEffect(() => {
    filterItems();
  }, [searchQuery, selectedCategory, items]);

  // Hàm lấy dữ liệu từ attributes (JSON string)
  const getAttributeValue = (entity: Entity, key: string) => {
    try {
      if (!entity.attributes) return null;
      const attributesObj = JSON.parse(entity.attributes);
      return attributesObj[key];
    } catch (error) {
      console.error("Error parsing attributes:", error);
      return null;
    }
  };

  // Hàm load dữ liệu từ Realm
  const loadItems = async () => {
    try {
      setLoading(true);
      // Lấy tất cả entities thuộc các danh mục đồ dùng
      // Lưu ý: Giả sử các danh mục đồ dùng gia đình có thể được đánh dấu trong Category type là "item"
      const type = ENTITY_TYPES.HOUSEHOLD_ITEM;
      const allEntities = getAllEntities<Entity>("Entity").filtered(
        `categoryId != null AND type == '${type}'`
      );
      // Chuyển đổi từ Realm Results sang Array
      const itemsArray = Array.from(allEntities);
      setItems(itemsArray);
    } catch (error) {
      console.error("Lỗi khi tải danh sách đồ dùng:", error);
    } finally {
      setLoading(false);
    }
  };

  // Hàm lọc items theo tìm kiếm và danh mục
  const filterItems = () => {
    let filtered = [...items];

    // Lọc theo tìm kiếm
    if (searchQuery) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Lọc theo danh mục
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (item) => item.categoryId === selectedCategory
      );
    }

    setFilteredItems(filtered);
  };

  // Hàm xử lý khi chọn danh mục
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  // Hàm xử lý khi thay đổi giá trị tìm kiếm
  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  // Hàm chuyển đổi giữa chế độ xem lưới và danh sách
  const toggleViewMode = () => {
    setIsGridView(!isGridView);
  };

  // Render item trong danh sách
  const renderListItem = ({ item }: { item: Entity }) => {
    // Tìm thông tin danh mục
    const category = categories.find((cat) => cat.id === item.categoryId);
    const categoryName = category ? category.name : "Khác";
    const categoryIcon = item.categoryId
      ? categoryIcons[item.categoryId as keyof typeof categoryIcons]
      : "cube";
    const categoryColor = item.categoryId
      ? categoryColors[item.categoryId as keyof typeof categoryColors]
      : "#E0F7FA";
    const categoryIconColor = item.categoryId
      ? categoryIconColors[item.categoryId as keyof typeof categoryIconColors]
      : "#00BCD4";

    // Lấy giá và vị trí từ attributes
    const price = getAttributeValue(item, "price");
    const itemLocation = item.location || getAttributeValue(item, "location");

    // Tìm thông tin vị trí
    const locationName = itemLocation
      ? locations[itemLocation as keyof typeof locations] || itemLocation
      : "Không xác định";

    // Format ngày hết hạn bảo hành
    const warrantyDate = item.expiryDate
      ? `${item.expiryDate.getMonth() + 1}/${item.expiryDate.getFullYear()}`
      : "Không có";

    return (
      <Pressable
        onPress={() => {
          console.log("Item pressed:", item);
          navigation.navigate("householdDetail", { itemId: item.id });
        }}
        mb={3}
      >
        <Box borderRadius="lg" overflow="hidden" bg="white" shadow={1} p={3}>
          <HStack space={3} alignItems="center">
            {item.imageUrl ? (
              <Image
                source={{ uri: item.imageUrl }}
                alt={item.name}
                size="sm"
                borderRadius="md"
                fallbackElement={
                  <Box
                    w="70px"
                    h="70px"
                    bg={categoryColor}
                    borderRadius="md"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Icon
                      as={Ionicons}
                      name={categoryIcon as any}
                      size="md"
                      color={categoryIconColor}
                    />
                  </Box>
                }
              />
            ) : (
              <Box
                w="70px"
                h="70px"
                bg={categoryColor}
                borderRadius="md"
                justifyContent="center"
                alignItems="center"
              >
                <Icon
                  as={Ionicons}
                  name={categoryIcon as any}
                  size="md"
                  color={categoryIconColor}
                />
              </Box>
            )}

            <VStack flex={1} space={1}>
              <Text fontWeight="bold" fontSize="md">
                {item.name}
              </Text>

              <HStack space={2} alignItems="center">
                <Icon
                  as={Ionicons}
                  name="location"
                  size="xs"
                  color="gray.500"
                />
                <Text fontSize="sm" color="gray.600">
                  {locationName}
                </Text>
              </HStack>

              <HStack space={2} alignItems="center">
                <Icon
                  as={Ionicons}
                  name="pricetag"
                  size="xs"
                  color="blue.500"
                />
                <Text fontSize="sm" color="gray.600">
                  {price ? formatCurrency(price) : "Không có giá"}
                </Text>
              </HStack>
            </VStack>

            <VStack alignItems="flex-end" space={1}>
              <Text fontSize="xs" color="gray.500">
                {warrantyDate}
              </Text>

              {item.quantity && item.quantity > 1 && (
                <Badge colorScheme="blue" rounded="full" variant="subtle">
                  {item.quantity}
                </Badge>
              )}

              <Icon
                as={Ionicons}
                name="chevron-forward"
                size="sm"
                color="gray.400"
              />
            </VStack>
          </HStack>
        </Box>
      </Pressable>
    );
  };

  // Render item dạng Grid
  const renderGridItem = ({ item }: { item: Entity }) => {
    // Tìm thông tin danh mục
    const categoryIcon = item.categoryId
      ? categoryIcons[item.categoryId as keyof typeof categoryIcons]
      : "cube";
    const categoryColor = item.categoryId
      ? categoryColors[item.categoryId as keyof typeof categoryColors]
      : "#E0F7FA";
    const categoryIconColor = item.categoryId
      ? categoryIconColors[item.categoryId as keyof typeof categoryIconColors]
      : "#00BCD4";

    // Lấy giá từ attributes
    const price = getAttributeValue(item, "price");

    // Lấy giá trị của item
    const { imageUrl, name } = item;

    // Tính toán chiều rộng của mỗi item dựa trên kích thước màn hình
    const screenWidth = Dimensions.get("window").width;
    const itemWidth = (screenWidth - 48) / 2; // 2 cột với padding 16 bên trái, 16 bên phải và 16 ở giữa

    return (
      <Pressable
        onPress={() => {
          navigation.navigate("householdDetail", { itemId: item.id });
        }}
        mb={3}
        mx={1.5}
      >
        <Box
          borderRadius="lg"
          overflow="hidden"
          bg="white"
          shadow={1}
          width={itemWidth - 3} // Trừ đi space giữa các item
        >
          {/* Phần hình ảnh */}
          <Box
            height={140}
            bg={categoryColor}
            justifyContent="center"
            alignItems="center"
          >
            {imageUrl ? (
              <Image
                source={{ uri: imageUrl }}
                alt={name}
                width="full"
                height="full"
                fallbackElement={
                  <Icon
                    as={Ionicons}
                    name={categoryIcon as any}
                    size="4xl"
                    color={categoryIconColor}
                  />
                }
              />
            ) : (
              <Icon
                as={Ionicons}
                name={categoryIcon as any}
                size="4xl"
                color={categoryIconColor}
              />
            )}
          </Box>

          {/* Phần thông tin */}
          <VStack p={3} space={1}>
            <Text fontWeight="bold" fontSize="md" numberOfLines={1}>
              {name}
            </Text>

            <Text color="gray.600" fontSize="sm">
              {price ? formatCurrency(price) : "Không có giá"}
            </Text>

            <HStack justifyContent="space-between" alignItems="center" mt={1}>
              {item.quantity && item.quantity > 1 && (
                <Badge colorScheme="blue" rounded="full" variant="subtle">
                  {item.quantity}
                </Badge>
              )}
              <Icon
                as={Ionicons}
                name="chevron-forward"
                size="sm"
                color="gray.400"
                ml="auto"
              />
            </HStack>
          </VStack>
        </Box>
      </Pressable>
    );
  };

  // Render EmptyState khi không có dữ liệu
  const renderEmptyState = () => (
    <Center flex={1} p={10}>
      <Icon as={Ionicons} name="cube-outline" size="6xl" color="gray.300" />
      <Text fontSize="xl" fontWeight="bold" color="gray.500" mt={4}>
        Chưa có đồ dùng nào
      </Text>
      <Text fontSize="md" color="gray.400" textAlign="center" mt={2}>
        Nhấn nút + để thêm đồ dùng mới
      </Text>
    </Center>
  );

  return (
    <Box flex={1} bg="gray.100" safeAreaTop>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      {/* Header */}
      <Box bg="white" px={4} py={4}>
        <HStack alignItems="center" justifyContent="space-between">
          <Heading size="lg">Đồ dùng</Heading>

          <HStack space={2}>
            <IconButton
              icon={
                <Icon
                  as={Ionicons}
                  name={isGridView ? "list" : "grid"}
                  size="sm"
                  color="gray.600"
                />
              }
              borderRadius="full"
              variant="ghost"
              onPress={toggleViewMode}
            />
          </HStack>
        </HStack>
      </Box>
      {/* Search Bar */}
      <Box px={4} py={3} bg="white">
        <Input
          placeholder="Tìm kiếm đồ dùng..."
          value={searchQuery}
          onChangeText={handleSearch}
          width="full"
          borderRadius="lg"
          py={3}
          px={4}
          fontSize="md"
          InputLeftElement={
            <Icon
              as={Ionicons}
              name="search"
              size="sm"
              ml={3}
              color="gray.400"
            />
          }
          rightElement={
            searchQuery ? (
              <IconButton
                icon={
                  <Icon
                    as={Ionicons}
                    name="close-circle"
                    size="sm"
                    color="gray.400"
                  />
                }
                borderRadius="full"
                variant="ghost"
                onPress={() => setSearchQuery("")}
                mr={1}
              />
            ) : undefined
          }
        />
      </Box>
      {/* Category Filter */}
      <Box bg="white" mb={3}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          px={4}
          py={3}
        >
          <HStack space={2}>
            {categories.map((category) => (
              <Pressable
                key={category.id}
                onPress={() => handleCategorySelect(category.id)}
              >
                <Box
                  bg={
                    selectedCategory === category.id ? "green.500" : "gray.100"
                  }
                  px={4}
                  py={2}
                  borderRadius="full"
                >
                  <Text
                    color={
                      selectedCategory === category.id ? "white" : "gray.600"
                    }
                    fontWeight={
                      selectedCategory === category.id ? "bold" : "normal"
                    }
                  >
                    {category.name}
                  </Text>
                </Box>
              </Pressable>
            ))}
          </HStack>
        </ScrollView>
      </Box>
      {loading ? (
        <Center flex={1}>
          <Spinner size="lg" color="green.500" />
        </Center>
      ) : isGridView ? (
        // Grid View
        <FlatList
          key="grid"
          data={filteredItems}
          renderItem={renderGridItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyState}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between" }}
        />
      ) : (
        // List View
        <FlatList
          key="list"
          data={filteredItems}
          renderItem={renderListItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyState}
        />
      )}
      {/* Add Button */}
      <Box position="absolute" right={4} bottom={20}>
        <Pressable
          onPress={() => navigation.navigate("AddHouseHold")}
          bg="green.500"
          w={16}
          h={16}
          borderRadius="full"
          justifyContent="center"
          alignItems="center"
          shadow={4}
        >
          <Icon as={Ionicons} name="add" size="xl" color="white" />
        </Pressable>
      </Box>
    </Box>
  );
};

export default HouseholdItemsScreen;

// Utility function để format số tiền thành dạng tiền tệ VND
