import { useEffect, useRef } from "react";
import { Icon, Text } from "native-base";
import Animated, {
  runOnJS,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ToastType } from "@/constants/common";

interface ToastProps {
  type: ToastType;
  message: string;
  duration?: number;
  onClose?: () => void;
  visible?: boolean;
}
const Toast: React.FC<ToastProps> = ({
  type = "info",
  message,
  duration = 3000,
  onClose,
  visible = true,
}) => {
  const opacity = useSharedValue(0);
  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, {
        duration: 300,
      });
    }
    const timer = setTimeout(() => {
      hideToast();
    }, duration);
    return () => clearTimeout(timer);
  }, [visible]);
  const hideToast = () => {
    opacity.value = withTiming(0, { duration: 300 }, () => {
      if (onClose) {
        runOnJS(onClose)();
      }
    });
  };
  const getIconAndColor = () => {
    switch (type) {
      case "success":
        return { icon: "checkmark-circle", color: "#4CAF50", bg: "#E8F5E9" };
      case "error":
        return { icon: "close-circle", color: "#F44336", bg: "#FFEBEE" };
      case "warning":
        return { icon: "warning", color: "#FF9800", bg: "#FFF8E1" };
      case "info":
      default:
        return { icon: "information-circle", color: "#2196F3", bg: "#E3F2FD" };
    }
  };
  const { icon, color, bg } = getIconAndColor();

  return (
    <Animated.View style={[styles.container, { opacity, backgroundColor: bg }]}>
      <View style={styles.content}>
        <Icon name={icon} color={color} />
        <Text style={[styles.message, { color }]}>{message}</Text>
      </View>
    </Animated.View>
  );
};
const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 30,
    left: 20,
    right: 20,
    borderRadius: 8,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1000,
  },
  content: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  message: {
    marginLeft: 20,
    fontSize: 14,
    fontWeight: "500",
    flexShrink: 1,
  },
  closeButton: {
    marginLeft: 8,
    padding: 4,
  },
});
export default Toast;
