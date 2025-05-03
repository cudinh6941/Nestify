import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Pressable,
  StyleProp,
  ViewStyle,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
  runOnJS,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { ScrollView } from "native-base";

const { height: screenHeight } = Dimensions.get("window");

interface BottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  snapPoints?: number[]; // ví dụ: [0.4, 0.8]
  containerStyle?: StyleProp<ViewStyle>;
}

const BottomSheet: React.FC<BottomSheetProps> = ({
  isVisible,
  onClose,
  children,
  snapPoints = [0.3],
  containerStyle,
}) => {
  const translateY = useSharedValue(screenHeight);
  const backdropOpacity = useSharedValue(0);

  const snapTo = screenHeight * (1 - snapPoints[0]);

  // Cấu hình spring animation tốt hơn
  const springConfig = {
    damping: 18, // Giảm damping để có nhiều "bounce" hơn
    stiffness: 100, // Tăng stiffness để animation nhanh hơn
    mass: 1, // Giữ mass thấp
    overshootClamping: false, // Cho phép "overshoot" nhẹ
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  };

  // Cấu hình timing animation cho backdrop
  const timingConfig = {
    duration: 250,
    easing: Easing.out(Easing.cubic),
  };

  useEffect(() => {
    if (isVisible) {
      // Mở BottomSheet
      translateY.value = withSpring(snapTo, springConfig);
      backdropOpacity.value = withTiming(1, timingConfig);
    } else {
      // Đóng BottomSheet
      translateY.value = withSpring(screenHeight, springConfig);
      backdropOpacity.value = withTiming(0, timingConfig);
    }
  }, [isVisible]);

  const closeSheet = () => {
    // Đảm bảo animation đóng trước khi gọi onClose
    translateY.value = withSpring(screenHeight, springConfig, () => {
      runOnJS(onClose)();
    });
    backdropOpacity.value = withTiming(0, timingConfig);
  };

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      // Giới hạn mức kéo lên tối đa
      translateY.value = Math.max(snapTo * 0.6, snapTo + event.translationY);

      // Thay đổi opacity backdrop dựa trên vị trí
      const progress =
        1 - Math.min(1, (translateY.value - snapTo) / (screenHeight - snapTo));
      backdropOpacity.value = progress;
    })
    .onEnd((event) => {
      const velocity = event.velocityY;
      const shouldClose =
        velocity > 400 || // Giảm ngưỡng vận tốc
        translateY.value > snapTo + (screenHeight - snapTo) * 0.4; // Điều chỉnh ngưỡng

      if (shouldClose) {
        runOnJS(closeSheet)();
      } else {
        // Spring về vị trí mở
        translateY.value = withSpring(snapTo, springConfig);
        backdropOpacity.value = withTiming(1, timingConfig);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  return (
    <>
      {isVisible && (
        <>
          <Animated.View style={[styles.backdrop, backdropStyle]}>
            <Pressable style={styles.pressable} onPress={closeSheet} />
          </Animated.View>

          <GestureDetector gesture={panGesture}>
            <Animated.View
              style={[styles.sheetContainer, animatedStyle, containerStyle]}
            >
              <View style={styles.handle} />
              <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
              >
                {children}
              </ScrollView>
            </Animated.View>
          </GestureDetector>
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1,
  },
  pressable: {
    width: "100%",
    height: "100%",
  },
  sheetContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: screenHeight,
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 10,
    paddingBottom: 20,
    zIndex: 2,
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: "#ccc",
    borderRadius: 3,
    alignSelf: "center",
    marginVertical: 12,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
});

export default BottomSheet;
