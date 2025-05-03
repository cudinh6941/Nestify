import { Box, HStack, Icon, ScrollView, Text, VStack } from "native-base";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Keyboard, LayoutChangeEvent, View, Dimensions } from "react-native";
import { TouchableWithoutFeedback } from "react-native";
import HomeHeader from "@/components/Header";
import { CardOverview } from "@/components/CardOverview";
import {
  MaterialIcons,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { MonthBudget } from "@/components/MonthBudget";
import { ItemCategory } from "../../components/ItemCategory";
import {
  useNavigation,
  useRoute,
  NavigationProp,
} from "@react-navigation/native";

type RootStackParamList = {
  household: undefined;
  // Add other routes here if needed
};

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [maxWidth, setMaxWidth] = useState<number>(0);
  const [measuring, setMeasuring] = useState<boolean>(true);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const route = useRoute();
  const measuredWidths = useRef<number[]>([]);
  useEffect(() => {
    if (route.params && showAddMenu == false) {
      if ((route.params as any).showAddModal) {
        setShowAddMenu(true);
        navigation.setParams({ showAddModal: undefined } as any);
      }
    }
  }, [route.params, navigation]);

  const notifications = [
    {
      type: "today" as const,
      quantity: 3,
      title: "Việc hôm nay",
      iconName: "event-note",
      onPress: () => console.log("Việc hôm nay pressed"),
    },
    {
      type: "attention" as const,
      quantity: 2,
      title: "Cần chú ý",
      iconName: "warning",
      onPress: () => console.log("Cần chú ý pressed"),
    },
    {
      type: "deadline" as const,
      quantity: 5,
      title: "Sắp hết hạn",
      iconName: "alarm",
      onPress: () => console.log("Sắp hết hạn pressed"),
    },
  ];

  // Danh sách danh mục
  const categories = [
    {
      id: "household" as keyof RootStackParamList,
      type: "furniture" as const,
      title: "Đồ dùng",
      count: 24,
      countLabel: "vật phẩm",
      iconType: "MaterialIcons" as const,
      iconName: "chair",
    },
    {
      id: "pet" as keyof RootStackParamList, // Adjusted to match RootStackParamList
      type: "pet" as const,
      title: "Vật nuôi",
      count: 2,
      countLabel: "thú cưng",
      iconType: "FontAwesome5" as const,
      iconName: "cat",
    },
    {
      id: "household" as keyof RootStackParamList, // Adjusted to match RootStackParamList
      type: "plant" as const,
      title: "Cây cối",
      count: 8,
      countLabel: "cây",
      iconType: "MaterialCommunityIcons" as const,
      iconName: "sprout",
    },
    {
      id: "household" as keyof RootStackParamList, // Adjusted to match RootStackParamList
      type: "expense" as const,
      title: "Chi tiêu",
      count: 15,
      countLabel: "khoản",
      iconType: "MaterialCommunityIcons" as const,
      iconName: "cash",
    },
  ];

  const handleLayout = (index: number) => (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    measuredWidths.current[index] = width;

    // check if all is measured
    if (
      measuredWidths.current.filter((w) => w !== undefined).length ===
      notifications.length
    ) {
      // find max width
      const maxWidthValue = Math.max(...measuredWidths.current);
      setMaxWidth(maxWidthValue);
      setMeasuring(false);
    }
  };

  //reset measure
  const resetMeasurements = () => {
    measuredWidths.current = [];
    setMaxWidth(0);
    setMeasuring(true);
  };

  useLayoutEffect(() => {
    resetMeasurements();

    const screenWidth = Dimensions.get("window").width;
    const estimatedWidth = (screenWidth - 40) / 3;
    setMaxWidth(estimatedWidth);
  }, [notifications.length]);

  const handleAvatarPress = () => {
    console.log("Avatar pressed");
  };

  const handleSearch = (text: string) => {
    console.log("Searching for:", text);
  };

  const handleCategoryPress = (categoryId: keyof RootStackParamList) => {
    navigation.navigate(categoryId);
  };

  const renderIcon = (category: any) => {
    const iconColor = "#555";

    switch (category.iconType) {
      case "MaterialIcons":
        return (
          <Icon as={MaterialIcons} name={category.iconName} color={iconColor} />
        );
      case "FontAwesome5":
        return (
          <Icon as={FontAwesome5} name={category.iconName} color={iconColor} />
        );
      case "MaterialCommunityIcons":
        return (
          <Icon
            as={MaterialCommunityIcons}
            name={category.iconName}
            color={iconColor}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Box p={4} bg="white">
            <HomeHeader
              username="Nguyễn Văn A"
              greeting="Xin chào,"
              avatarInitial="A"
              temperature="28°C"
              location="Hà Nội"
              onAvatarPress={handleAvatarPress}
              onSearch={handleSearch}
            />
          </Box>
          {/* Phần Overview */}
          <Text px={4} pt={2} pb={3} fontWeight="bold" fontSize="lg">
            Overview
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} px={4}>
            <HStack space={3}>
              {notifications.map((notification, index) => (
                <CardOverview
                  key={`card-${index}`}
                  type={notification.type}
                  quantity={notification.quantity}
                  title={notification.title}
                  width={maxWidth}
                  icon={
                    <Icon
                      as={MaterialIcons}
                      name={notification.iconName}
                      color="white"
                      size="sm"
                    />
                  }
                  onPress={notification.onPress}
                />
              ))}
            </HStack>
          </ScrollView>
          {/* Phần MonthBudget */}
          <Box p={4}>
            <MonthBudget usedPercentage="30%" />
          </Box>
          {/* Phần Danh mục */}
          <Text px={4} pt={2} pb={3} fontWeight="bold" fontSize="lg">
            Danh mục
          </Text>
          <Box px={4} pb={4}>
            <VStack space={4}>
              <HStack space={4} justifyContent="space-between">
                <ItemCategory
                  type={categories[0].type}
                  title={categories[0].title}
                  count={categories[0].count}
                  countLabel={categories[0].countLabel}
                  icon={renderIcon(categories[0])}
                  onPress={() => handleCategoryPress(categories[0].id)}
                />
                <ItemCategory
                  type={categories[1].type}
                  title={categories[1].title}
                  count={categories[1].count}
                  countLabel={categories[1].countLabel}
                  icon={renderIcon(categories[1])}
                  onPress={() => handleCategoryPress(categories[1].id)}
                />
              </HStack>

              <HStack space={4} justifyContent="space-between">
                <ItemCategory
                  type={categories[2].type}
                  title={categories[2].title}
                  count={categories[2].count}
                  countLabel={categories[2].countLabel}
                  icon={renderIcon(categories[2])}
                  onPress={() => handleCategoryPress(categories[2].id)}
                />
                <ItemCategory
                  type={categories[3].type}
                  title={categories[3].title}
                  count={categories[3].count}
                  countLabel={categories[3].countLabel}
                  icon={renderIcon(categories[3])}
                  onPress={() => handleCategoryPress(categories[3].id)}
                />
              </HStack>
            </VStack>
          </Box>
          {measuring && (
            <Box position="absolute" opacity={0} pointerEvents="none">
              <HStack space={3}>
                {notifications.map((notification, index) => (
                  <View key={`measure-${index}`} onLayout={handleLayout(index)}>
                    <CardOverview
                      type={notification.type}
                      quantity={notification.quantity}
                      title={notification.title}
                      icon={
                        <Icon
                          as={MaterialIcons}
                          name={notification.iconName}
                          color="white"
                          size="sm"
                        />
                      }
                    />
                  </View>
                ))}
              </HStack>
            </Box>
          )}
        </ScrollView>
      </TouchableWithoutFeedback>
    </>
  );
};

export default HomeScreen;
