/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const greenPrimary = "#4CAF50";
const greenLight = "#e8f5e9";
const greenDark = "#2E7D32";
const accentOrange = "#FF9800";
const accentBlue = "#2196F3";

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

export const Colors = {
  light: {
    text: "#11181C",
    textSecondary: "#757575",
    background: "#fff",
    backgroundAlt: "#F5F5F5",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,

    primary: greenPrimary,
    primaryLight: greenLight,
    primaryDark: greenDark,
    accent: accentOrange,
    accentAlt: accentBlue,
    grey: "#E0E0E0",
    success: "#00C853",
    warning: "#FFD600",
    error: "#D50000",
  },
  dark: {
    text: "#ECEDEE",
    textSecondary: "#9BA1A6",
    background: "#151718",
    backgroundAlt: "#1E2021",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,

    primary: "#5CBA60",
    primaryLight: "#9BD69A",
    primaryDark: "#3E8E41",
    accent: "#FFA726",
    accentAlt: "#42A5F5",
    grey: "#424242",
    success: "#00E676",
    warning: "#FFEA00",
    error: "#FF1744",
  },
};
