import { Colors } from "@/constants/Colors";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { Box, Center, HStack, Icon, VStack, Text } from "native-base";
import { TouchableOpacity } from "react-native";

export default function TabBar({ state, descriptors, navigation }: any) {
  return (
    <Box bg="white" width="100%" alignSelf="center">
      <HStack alignItems="center">
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel || options.title || route.name;

          const isFocused = state.index === index;
          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              if (route.name === "Add") {
                console.log("ADD tapped");
                navigation.navigate("AddMenu");
              } else {
                navigation.navigate(route.name);
              }
            }
          };

          let iconName: string;
          let IconComponent: any = MaterialCommunityIcons;

          switch (route.name) {
            case "Home":
              iconName = "home";
              break;
            case "Calendar":
              iconName = "calendar-month";
              break;
            case "Add":
              iconName = "plus";
              IconComponent = Feather;
              break;
            case "Statistics":
              iconName = "chart-bar";
              break;
            case "Settings":
              iconName = "cog";
              break;
            default:
              iconName = "circle";
          }
          const color = isFocused ? "blue" : "gray.400";
          if (route.name === "Add") {
            return (
              <TouchableOpacity
                key={index}
                style={{
                  opacity: 1,
                  flex: 1,
                }}
                onPress={onPress}
              >
                <Center>
                  <Center
                    bg={Colors.light.primary}
                    rounded="full"
                    size="60px"
                    top="-35px"
                    shadow={3}
                  >
                    <Icon
                      as={IconComponent}
                      name={iconName}
                      color="white"
                      size="30px"
                    />
                  </Center>
                </Center>
              </TouchableOpacity>
            );
          }
          return (
            <TouchableOpacity
              key={index}
              style={{
                opacity: 1,
                paddingVertical: 12,
                flex: 1,
              }}
              onPress={onPress}
            >
              <VStack alignItems="center" space={1}>
                <Icon
                  as={IconComponent}
                  name={iconName}
                  color={color}
                  size="24px"
                />
                <Text color={color} fontSize="12px">
                  {label}
                </Text>
                {/* {isFocused && (
                  <Box
                    position="absolute"
                    top="0"
                    width="40%"
                    // height="2px"
                    bg="blue.100"
                  />
                )} */}
              </VStack>
            </TouchableOpacity>
          );
        })}
      </HStack>
    </Box>
  );
}
