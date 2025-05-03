import React, { useState, useEffect } from "react";
import {
  Box,
  VStack,
  HStack,
  ScrollView,
  Text,
  Heading,
  Image,
  Icon,
  IconButton,
  Divider,
  Badge,
  Switch,
  Button,
  useToast,
  Center,
  Spinner,
} from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useRealmUtils } from "@/hooks/useReamUtils";
import { Alert, Platform } from "react-native";
import { formatCurrency } from "@/Utils/formatUtils";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

// Cấu hình cách hiển thị notifications khi ứng dụng đang chạy
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Định nghĩa kiểu dữ liệu cho params từ route
interface RouteParams {
  itemId: string;
}

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

const ItemDetailScreen = () => {
  const [item, setItem] = useState<Entity | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [remindWarranty, setRemindWarranty] = useState<boolean>(false);
  const [remindMaintenance, setRemindMaintenance] = useState<boolean>(false);
  const [attributes, setAttributes] = useState<any>({});
  const [notificationPermission, setNotificationPermission] =
    useState<boolean>(false);

  const route = useRoute();
  const navigation = useNavigation();
  const toast = useToast();
  const { itemId } = route.params as RouteParams;
  const { getEntityById, updateEntity, deleteEntity } = useRealmUtils();

  // Danh sách các danh mục
  const categories = {
    electronic: "Đồ điện tử",
    furniture: "Đồ nội thất",
    kitchen: "Thiết bị bếp",
    clothes: "Quần áo",
    others: "Khác",
  };

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

  //Yêu cầu quyền thông báo khi component mount
  useEffect(() => {
    requestNotificationPermission();
    console.log("Item ID:", itemId);
    loadItem();
  }, [itemId]);

  // Hàm yêu cầu quyền thông báo
  const requestNotificationPermission = async () => {
    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      setNotificationPermission(finalStatus === "granted");

      if (finalStatus !== "granted") {
        Alert.alert(
          "Thông báo",
          "Bạn cần cho phép ứng dụng gửi thông báo để nhận được nhắc nhở.",
          [{ text: "Đồng ý" }]
        );
        return false;
      }
      return true;
    } else {
      Alert.alert(
        "Thông báo",
        "Tính năng thông báo chỉ hoạt động trên thiết bị thật."
      );
      return false;
    }
  };

  // Hàm gửi thông báo ngay lập tức
  const sendLocalNotification = async (title: string, message: string) => {
    try {
      // Kiểm tra quyền trước khi gửi
      const hasPermission = await requestNotificationPermission();
      if (!hasPermission) return;

      await Notifications.scheduleNotificationAsync({
        content: {
          title: title,
          body: message,
          data: { itemId: itemId },
        },
        trigger: null, // null nghĩa là hiển thị ngay lập tức
      });

      console.log("Đã gửi thông báo:", title, message);
    } catch (error) {
      console.error("Lỗi khi gửi thông báo:", error);
    }
  };


  const parseAttributes = (attributesStr: string | null) => {
    if (!attributesStr) return {};
    try {
      return JSON.parse(attributesStr);
    } catch (error) {
      console.error("Error parsing attributes:", error);
      return {};
    }
  };

  // Hàm load thông tin item từ Realm
  const loadItem = async () => {
    try {
      setLoading(true);
      const entityData = getEntityById<Entity>("Entity", itemId);

      if (entityData) {
        setItem(entityData);

        // Parse attributes
        const parsedAttributes = parseAttributes(entityData.attributes);
        setAttributes(parsedAttributes);

        // Set reminder states
        setRemindWarranty(parsedAttributes.remindWarranty || false);
        setRemindMaintenance(parsedAttributes.remindMaintenance || false);
      } else {
        toast.show({
          title: "Lỗi",
          description: "Không tìm thấy thông tin đồ dùng",
        });
        navigation.goBack();
      }
    } catch (error) {
      console.error("Lỗi khi tải thông tin đồ dùng:", error);
      toast.show({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi tải thông tin",
      });
    } finally {
      setLoading(false);
    }
  };

  // Hàm xử lý khi thay đổi trạng thái nhắc nhở bảo hành
  const handleToggleWarrantyReminder = async (value: boolean) => {
    setRemindWarranty(value);
    if (item) {
      try {
        // Cập nhật vào attributes
        const updatedAttributes = { ...attributes, remindWarranty: value };

        updateEntity("Entity", item.id, {
          attributes: JSON.stringify(updatedAttributes),
        });

        setAttributes(updatedAttributes);

        // Hiển thị thông báo trong app
        toast.show({
          title: value
            ? "Đã bật nhắc nhở bảo hành"
            : "Đã tắt nhắc nhở bảo hành",
          placement: "bottom",
        });

        // Nếu bật nhắc nhở, gửi thông báo ngay lập tức để kiểm tra
        if (value) {
          await sendLocalNotification(
            "Nhắc nhở bảo hành đã bật",
            `Bạn sẽ được nhắc nhở khi sắp hết hạn bảo hành cho ${item.name}.`
          );

          // Nếu có ngày hết hạn, đặt lịch thông báo trước 7 ngày
          if (item.expiryDate) {
            const reminderDate = new Date(item.expiryDate);
            reminderDate.setDate(reminderDate.getDate() - 7);

            // Nếu ngày nhắc đã qua, không đặt lịch
            // if (reminderDate > new Date()) {
            //   await scheduleNotification(
            //     "Sắp hết hạn bảo hành",
            //     `${item.name} sẽ hết hạn bảo hành vào ngày ${formatDate(item.expiryDate)}`,
            //     reminderDate
            //   );
            // }
          }
        }
      } catch (error) {
        console.error("Lỗi khi cập nhật trạng thái nhắc nhở:", error);
      }
    }
  };

  // Hàm xử lý khi thay đổi trạng thái nhắc nhở bảo dưỡng
  const handleToggleMaintenanceReminder = async (value: boolean) => {
    setRemindMaintenance(value);
    if (item) {
      try {
        // Cập nhật vào attributes
        const updatedAttributes = { ...attributes, remindMaintenance: value };

        updateEntity("Entity", item.id, {
          attributes: JSON.stringify(updatedAttributes),
        });

        setAttributes(updatedAttributes);

        // Hiển thị thông báo trong app
        toast.show({
          title: value
            ? "Đã bật nhắc nhở bảo dưỡng"
            : "Đã tắt nhắc nhở bảo dưỡng",
          placement: "bottom",
        });

        // Nếu bật nhắc nhở, gửi thông báo ngay lập tức để kiểm tra
        if (value) {
          await sendLocalNotification(
            "Nhắc nhở bảo dưỡng đã bật",
            `Bạn sẽ được nhắc nhở khi đến lịch bảo dưỡng ${item.name}.`
          );

          // Nếu có ngày bảo dưỡng tiếp theo, đặt lịch thông báo
          if (item.nextServiceDate) {
            const reminderDate = new Date(item.nextServiceDate);
            reminderDate.setDate(reminderDate.getDate() - 3); // Nhắc trước 3 ngày

            // Nếu ngày nhắc đã qua, không đặt lịch
            // if (reminderDate > new Date()) {
            //   await scheduleNotification(
            //     "Sắp đến lịch bảo dưỡng",
            //     `${item.name} cần được bảo dưỡng vào ngày ${formatDate(item.nextServiceDate)}`,
            //     reminderDate
            //   );
            // }
          }
        }
      } catch (error) {
        console.error("Lỗi khi cập nhật trạng thái nhắc nhở:", error);
      }
    }
  };

  // Hàm xóa đồ dùng
  const handleDeleteItem = () => {
    Alert.alert(
      "Xác nhận xóa",
      "Bạn có chắc chắn muốn xóa đồ dùng này không?",
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Xóa",
          style: "destructive",
          onPress: () => {
            try {
              deleteEntity("Entity", itemId);
              toast.show({
                title: "Đã xóa đồ dùng",
              });
              navigation.goBack();
            } catch (error) {
              console.error("Lỗi khi xóa đồ dùng:", error);
              toast.show({
                title: "Lỗi",
                description: "Có lỗi xảy ra khi xóa đồ dùng",
              });
            }
          },
        },
      ]
    );
  };

  // Hàm format ngày thành chuỗi dd/mm/yyyy
  const formatDate = (date?: Date): string => {
    if (!date) return "Không có";
    return `${date.getDate().toString().padStart(2, "0")}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`;
  };

  // Trạng thái bảo hành
  const getWarrantyStatus = (date?: Date): { label: string; color: string } => {
    if (!date) return { label: "Không có", color: "gray.500" };

    const today = new Date();
    if (date < today) {
      return { label: "Đã hết hạn", color: "red.500" };
    }

    // Còn 30 ngày nữa là hết hạn
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    if (date < thirtyDaysFromNow) {
      return { label: "Sắp hết hạn", color: "orange.500" };
    }

    return { label: "Còn hạn", color: "green.500" };
  };

  // Hàm test thông báo ngay lập tức
  const testNotification = async () => {
    if (!item) return;

    await sendLocalNotification(
      "Kiểm tra thông báo",
      `Đây là thông báo kiểm tra cho ${item.name}`
    );

    toast.show({
      title: "Đã gửi thông báo kiểm tra",
      placement: "bottom",
    });
  };

  if (loading) {
    return (
      <Center flex={1} bg="white">
        <Spinner size="lg" color="green.500" />
      </Center>
    );
  }

  if (!item) {
    return (
      <Center flex={1} bg="white">
        <Text>Không có thông tin</Text>
      </Center>
    );
  }

  // Phần còn lại giữ nguyên không thay đổi
  // Tìm thông tin danh mục
  const categoryName = item.categoryId
    ? categories[item.categoryId as keyof typeof categories]
    : "Không có";
  const categoryIcon = item.categoryId
    ? categoryIcons[item.categoryId as keyof typeof categoryIcons]
    : "cube";
  const categoryColor = item.categoryId
    ? categoryColors[item.categoryId as keyof typeof categoryColors]
    : "#E0F7FA";
  const categoryIconColor = item.categoryId
    ? categoryIconColors[item.categoryId as keyof typeof categoryIconColors]
    : "#00BCD4";

  // Tìm thông tin vị trí
  const locationName = item.location
    ? locations[item.location as keyof typeof locations] || item.location
    : attributes.location
    ? locations[attributes.location as keyof typeof locations] ||
      attributes.location
    : "Không xác định";

  // Lấy giá từ attributes
  const price = attributes.price || 0;

  // Lấy ngày mua từ attributes
  const purchaseDate = attributes.purchaseDate
    ? new Date(attributes.purchaseDate)
    : undefined;

  // Trạng thái bảo hành
  const warrantyStatus = getWarrantyStatus(item.expiryDate);

  return (
    <Box flex={1} bg="gray.100" safeAreaTop>
      {/* Khu vực hình ảnh */}
      <Box bg={categoryColor} height={250} width="full">
        {item.imageUrl ? (
          <Image
            source={{ uri: item.imageUrl }}
            alt={item.name}
            width="full"
            height="full"
            resizeMode="cover"
            fallbackElement={
              <Center width="full" height="full">
                <Icon
                  as={Ionicons}
                  name={categoryIcon as any}
                  size="5xl"
                  color={categoryIconColor}
                />
              </Center>
            }
          />
        ) : (
          <Center width="full" height="full">
            <Icon
              as={Ionicons}
              name={categoryIcon as any}
              size="5xl"
              color={categoryIconColor}
            />
          </Center>
        )}

        {/* Nút quay lại */}
        <IconButton
          icon={<Icon as={Ionicons} name="arrow-back" color="black" />}
          onPress={() => {
            console.log("Quay lại");
            navigation.goBack();
          }}
          position="absolute"
          top={3}
          left={3}
          borderRadius="full"
          bg="white"
        />

        {/* Nút xóa */}
        <IconButton
          icon={<Icon as={Ionicons} name="trash-outline" color="red.500" />}
          onPress={handleDeleteItem}
          position="absolute"
          top={3}
          right={3}
          borderRadius="full"
          bg="white"
        />
      </Box>

      <ScrollView flex={1} bg="white">
        <VStack space={4} p={5} pt={4}>
          {/* Tên và giá */}
          <VStack>
            <Heading size="lg">{item.name}</Heading>
            <HStack alignItems="center" space={2} mt={1}>
              <Text fontSize="xl" fontWeight="bold" color="green.600">
                {formatCurrency(price)}
              </Text>
              {warrantyStatus.label !== "Không có" && (
                <Badge
                  colorScheme={warrantyStatus.color.split(".")[0]}
                  variant="subtle"
                  rounded="md"
                >
                  {warrantyStatus.label}
                </Badge>
              )}
            </HStack>
          </VStack>

          <Divider />

          {/* Thông tin chi tiết */}
          <VStack space={3}>
            <Heading size="md">Thông tin chi tiết</Heading>

            <HStack justifyContent="space-between" alignItems="center">
              <Text color="gray.500">Danh mục</Text>
              <Text fontWeight="medium">{categoryName}</Text>
            </HStack>

            <HStack justifyContent="space-between" alignItems="center">
              <Text color="gray.500">Vị trí</Text>
              <Text fontWeight="medium">{locationName}</Text>
            </HStack>

            <HStack justifyContent="space-between" alignItems="center">
              <Text color="gray.500">Ngày mua</Text>
              <Text fontWeight="medium">{formatDate(purchaseDate)}</Text>
            </HStack>

            <HStack justifyContent="space-between" alignItems="center">
              <Text color="gray.500">Hết hạn bảo hành</Text>
              <Text fontWeight="medium" color={warrantyStatus.color}>
                {formatDate(item.expiryDate)}
              </Text>
            </HStack>

            <HStack justifyContent="space-between" alignItems="center">
              <Text color="gray.500">Số lượng</Text>
              <Text fontWeight="medium">{item.quantity || 1}</Text>
            </HStack>
          </VStack>

          <Divider />

          {/* Phần nhắc nhở */}
          <VStack space={3}>
            <Heading size="md">Nhắc nhở</Heading>

            <HStack justifyContent="space-between" alignItems="center">
              <Text>Nhắc khi hết hạn bảo hành</Text>
              <Switch
                isChecked={remindWarranty}
                onToggle={handleToggleWarrantyReminder}
                colorScheme="green"
                isDisabled={!item.expiryDate}
              />
            </HStack>

            <HStack justifyContent="space-between" alignItems="center">
              <Text>Nhắc bảo dưỡng định kỳ</Text>
              <Switch
                isChecked={remindMaintenance}
                onToggle={handleToggleMaintenanceReminder}
                colorScheme="green"
              />
            </HStack>

            <Button
              mt={2}
              colorScheme="orange"
              leftIcon={
                <Icon as={Ionicons} name="notifications-outline" size="sm" />
              }
              onPress={testNotification}
            >
              Kiểm tra thông báo
            </Button>
          </VStack>

          <Divider />

          {/* Phần chỉnh sửa */}
          <Button
            colorScheme="blue"
            leftIcon={<Icon as={Ionicons} name="create-outline" size="sm" />}
            onPress={() => {}}
            mb={2}
          >
            Chỉnh sửa thông tin
          </Button>

          <Button
            colorScheme="red"
            variant="outline"
            leftIcon={<Icon as={Ionicons} name="trash-outline" size="sm" />}
            onPress={handleDeleteItem}
            mb={5}
          >
            Xóa đồ dùng
          </Button>
        </VStack>
      </ScrollView>
    </Box>
  );
};

export default ItemDetailScreen;
