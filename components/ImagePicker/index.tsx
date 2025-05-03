import { Ionicons } from "@expo/vector-icons";
import { Box, Icon, Image, VStack, Text } from "native-base";
import { useImperativeHandle, forwardRef } from "react";
import { PermissionsAndroid, Platform, TouchableOpacity } from "react-native";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";

export interface ImagePickerMethods {
  handleImageSelect: (source: "camera" | "library") => Promise<void>;
}

interface ImagePickerProps {
  imageUri: string | null;
  onImageSelected: (uri: string) => void;
  onPress?: () => void;
}

const ImagePicker = forwardRef<ImagePickerMethods, ImagePickerProps>(
  ({ imageUri, onImageSelected, onPress }, ref) => {
    const requestCameraPermission = async () => {
      if (Platform.OS === "android") {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
              title: "Yêu cầu quyền Camera",
              message: "Ứng dụng cần quyền truy cập camera để chụp ảnh",
              buttonNeutral: "Hỏi lại sau",
              buttonNegative: "Từ chối",
              buttonPositive: "Đồng ý",
            }
          );
          return granted === PermissionsAndroid.RESULTS.GRANTED;
        } catch (err) {
          console.warn(err);
          return false;
        }
      } else {
        return true;
      }
    };

    const handleImageSelect = async (source: "camera" | "library") => {
      const options = {
        mediaType: "photo" as const,
        includeBase64: false,
        selectionLimit: 1,
        saveToPhotos: true,
      };

      const callback = (response: any) => {
        if (response.didCancel) {
          console.log("User cancelled image picker");
        } else if (response.errorCode) {
          console.log(
            "ImagePicker Error:",
            response.errorCode,
            response.errorMessage
          );
        } else if (response.assets && response.assets.length > 0) {
          const selectedImageUri = response.assets[0].uri;
          if (selectedImageUri) {
            onImageSelected(selectedImageUri);
          }
        }
      };

      if (source === "camera") {
        // Kiểm tra quyền trước khi mở camera
        const hasPermission = await requestCameraPermission();
        if (hasPermission) {
          console.log("Da cap quyen");
          launchCamera(options, callback);
        } else {
          alert("Cần cấp quyền truy cập camera để sử dụng tính năng này");
        }
      } else {
        launchImageLibrary(options, callback);
      }
    };

    // Expose methods to parent component
    useImperativeHandle(ref, () => ({
      handleImageSelect,
    }));

    // Xử lý khi người dùng nhấn vào component
    const handlePress = () => {
      if (onPress) {
        onPress();
      }
    };

    return (
      <Box alignItems="center">
        <TouchableOpacity onPress={handlePress}>
          <Box
            bg="white"
            borderRadius="full"
            w={140}
            h={140}
            borderWidth={3}
            borderColor="#e0e0e0"
            justifyContent="center"
            alignItems="center"
            overflow="hidden"
          >
            {imageUri ? (
              <Image
                source={{ uri: imageUri }}
                alt="image"
                width="full"
                height="full"
              />
            ) : (
              <VStack alignItems="center" space={2}>
                <Box bg="#e8f5e9" p={3} borderRadius="full">
                  <Icon as={Ionicons} name="camera" size="xl" color="#4CAF50" />
                </Box>
                <Box>
                  <Text fontSize="md">Thêm ảnh</Text>
                </Box>
              </VStack>
            )}
          </Box>
        </TouchableOpacity>
      </Box>
    );
  }
);

export default ImagePicker;
