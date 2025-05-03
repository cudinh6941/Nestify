import "react-native-reanimated";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { NativeBaseProvider, extendTheme } from "native-base";
import Realm from "realm";
import { useColorScheme } from "@/hooks/useColorScheme";
import TabNavigator from "../components/TabNavigator";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { RealmProvider } from "@/Context/RealmProvider";
import ToastProvider from "@/Context/ToastProvider";
import { Host } from "react-native-portalize";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  console.log("Realm Database Path:", Realm.defaultPath); // hoặc Realm.defaultPath

  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const theme = extendTheme({
    colors: {
      primary: {
        50: "#e3f2fd",
        500: "#2196f3",
        700: "#1976d2",
      },
    },
    config: {
      initialColorMode: "light",
    },
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <RealmProvider>
        <NativeBaseProvider theme={theme}>
          <ToastProvider>
            <Host>
              <TabNavigator />
            </Host>
          </ToastProvider>
        </NativeBaseProvider>
      </RealmProvider>
    </GestureHandlerRootView>
  );
}
