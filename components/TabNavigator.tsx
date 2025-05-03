import TabBar from "@/components/TabBar";
import AddItem from "@/screens/AddItem";
import HomeScreen from "@/feature/home/homeScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Center, Text } from "native-base";
import AddMenu from "./Addmenu";
import HouseholdItemsScreen from "@/screens/ListItem";
import ItemDetailScreen from "@/screens/ItemDetail";
import AddPetScreen from "@/screens/AddPet";
import { FullStackParamList } from "./type/types";
import ListPetScreen from "@/screens/ListItemPett";

type TabParamList = {
  Home: undefined;
  Calendar: undefined;
  Add: undefined;
  Statistics: undefined;
  Settings: undefined;
};

const CalendarScreen = () => (
  <Center flex={1}>
    <Text>Lịch</Text>
  </Center>
);
const StatisticsScreen = () => (
  <Center flex={1}>
    <Text>Thống kê</Text>
  </Center>
);

const SettingsScreen = () => (
  <Center flex={1}>
    <Text>Cài đặt</Text>
  </Center>
);

const Tab = createBottomTabNavigator<TabParamList>();
function TabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarLabel: "Trang chu" }}
      />
      <Tab.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{ tabBarLabel: "Lich" }}
      />
      <Tab.Screen
        name="Add"
        component={AddItem}
        options={{ tabBarLabel: "" }}
      />
      <Tab.Screen
        name="Statistics"
        component={StatisticsScreen}
        options={{ tabBarLabel: "Thống kê" }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ tabBarLabel: "Cài đặt" }}
      />
    </Tab.Navigator>
  );
}
const Stack = createNativeStackNavigator<FullStackParamList>();
export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen
        name="AddMenu"
        component={AddMenu}
        options={{
          presentation: "modal",
          animation: "slide_from_bottom",
        }}
      />
      <Stack.Screen
        name="AddHouseHold"
        component={AddItem}
        options={{
          headerShown: true,
          headerTitle: "Thêm mới",
          headerBackTitle: "Trở lại",
          headerTintColor: "green",
          // headerStyle: {
          //   backgroundColor: Colors.light.primary,
          // },
          contentStyle: {
            flex: 1,
            marginTop: 0, // Ignore safe area
          },
        }}
      />
      <Stack.Screen
        name="household"
        component={HouseholdItemsScreen}
        options={{
          headerShown: true,
          headerTitle: "Đồ dùng", // Thêm tiêu đề tại đây
          headerTintColor: "green",
          headerTitleAlign: "left", // Đặt vị trí title: "left", "center" hoặc "right"
          // Thêm style cho title
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 20,
          },
          // headerStyle: {
          //   backgroundColor: Colors.light.primary,
          // },
          contentStyle: {
            flex: 1,
            marginTop: 0, // Ignore safe area
          },
        }}
      ></Stack.Screen>
      <Stack.Screen
        name="pet"
        component={ListPetScreen}
        options={{
          headerShown: true,
          headerTitle: "Đồ dùng", // Thêm tiêu đề tại đây
          headerTintColor: "green",
          headerTitleAlign: "left", // Đặt vị trí title: "left", "center" hoặc "right"
          // Thêm style cho title
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 20,
          },
          // headerStyle: {
          //   backgroundColor: Colors.light.primary,
          // },
          contentStyle: {
            flex: 1,
            marginTop: 0, // Ignore safe area
          },
        }}
      ></Stack.Screen>
      <Stack.Screen
        name="householdDetail"
        component={ItemDetailScreen}
        options={{
          headerShown: false,
          headerTitle: "Đồ dùng", // Thêm tiêu đề tại đây
          headerTintColor: "green",
          headerTitleAlign: "left", // Đặt vị trí title: "left", "center" hoặc "right"
          // Thêm style cho title
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 20,
          },
          // headerStyle: {
          //   backgroundColor: Colors.light.primary,
          // },
          contentStyle: {
            flex: 1,
            marginTop: 0, // Ignore safe area
          },
        }}
      ></Stack.Screen>
      <Stack.Screen
        name="AddPetScreen"
        component={AddPetScreen}
        options={{
          headerShown: true,
          headerTitle: "Thêm mới",
          headerBackTitle: "Trở lại",
          headerTintColor: "green",
          // headerStyle: {
          //   backgroundColor: Colors.light.primary,
          // },
          contentStyle: {
            flex: 1,
            marginTop: 0, // Ignore safe area
          },
        }}
      />
    </Stack.Navigator>
  );
}
