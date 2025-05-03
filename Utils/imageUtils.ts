/**
 * Các hàm tiện ích liên quan đến hình ảnh trong ứng dụng
 */
import {
  launchImageLibrary,
  launchCamera,
  CameraOptions,
  ImageLibraryOptions,
  ImagePickerResponse,
} from "react-native-image-picker";
import { Platform, PermissionsAndroid } from "react-native";

/**
 * Tùy chọn mặc định cho ImagePicker
 */
export const DEFAULT_IMAGE_PICKER_OPTIONS: ImageLibraryOptions = {
  mediaType: "photo",
  quality: 0.8,
  maxWidth: 1000,
  maxHeight: 1000,
  includeBase64: false,
};

/**
 * Yêu cầu quyền truy cập thư viện ảnh cho Android
 * @returns true nếu được cấp quyền, false nếu không
 */
export const requestMediaLibraryPermissions = async (): Promise<boolean> => {
  if (Platform.OS === "android") {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES ||
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: "Quyền truy cập thư viện ảnh",
          message:
            "Ứng dụng cần quyền truy cập thư viện ảnh để thêm hình ảnh cho đồ dùng của bạn.",
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
  }
  return true; // iOS tự xử lý quyền thông qua Info.plist
};

/**
 * Yêu cầu quyền truy cập camera
 * @returns true nếu được cấp quyền, false nếu không
 */
export const requestCameraPermissions = async (): Promise<boolean> => {
  if (Platform.OS === "android") {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "Quyền truy cập camera",
          message:
            "Ứng dụng cần quyền truy cập camera để chụp ảnh đồ dùng của bạn.",
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
  }
  return true; // iOS tự xử lý quyền thông qua Info.plist
};

/**
 * Mở thư viện ảnh và chọn một hình ảnh
 * @param options Tùy chọn cho ImagePicker
 * @returns URI của hình ảnh hoặc null nếu người dùng hủy
 */
export const pickImageFromLibrary = async (
  options: ImageLibraryOptions = DEFAULT_IMAGE_PICKER_OPTIONS
): Promise<string | null> => {
  try {
    // Kiểm tra quyền truy cập (chỉ cho Android)
    if (Platform.OS === "android") {
      const hasPermission = await requestMediaLibraryPermissions();
      if (!hasPermission) {
        console.log("Không có quyền truy cập thư viện ảnh");
        return null;
      }
    }

    // Mở thư viện ảnh
    return new Promise((resolve) => {
      launchImageLibrary(options, (response: ImagePickerResponse) => {
        if (response.didCancel) {
          resolve(null);
        } else if (response.errorCode) {
          console.error("Lỗi ImagePicker:", response.errorMessage);
          resolve(null);
        } else if (
          response.assets &&
          response.assets.length > 0 &&
          response.assets[0].uri
        ) {
          resolve(response.assets[0].uri);
        } else {
          resolve(null);
        }
      });
    });
  } catch (error) {
    console.error("Lỗi khi chọn ảnh:", error);
    return null;
  }
};

/**
 * Mở camera và chụp ảnh
 * @param options Tùy chọn cho Camera
 * @returns URI của hình ảnh hoặc null nếu người dùng hủy
 */
export const takePicture = async (
  options: CameraOptions = DEFAULT_IMAGE_PICKER_OPTIONS
): Promise<string | null> => {
  try {
    // Kiểm tra quyền truy cập (chỉ cho Android)
    if (Platform.OS === "android") {
      const hasPermission = await requestCameraPermissions();
      if (!hasPermission) {
        console.log("Không có quyền truy cập camera");
        return null;
      }
    }

    // Mở camera
    return new Promise((resolve) => {
      launchCamera(options, (response: ImagePickerResponse) => {
        if (response.didCancel) {
          resolve(null);
        } else if (response.errorCode) {
          console.error("Lỗi Camera:", response.errorMessage);
          resolve(null);
        } else if (
          response.assets &&
          response.assets.length > 0 &&
          response.assets[0].uri
        ) {
          resolve(response.assets[0].uri);
        } else {
          resolve(null);
        }
      });
    });
  } catch (error) {
    console.error("Lỗi khi chụp ảnh:", error);
    return null;
  }
};

/**
 * Tạo menu chọn hình ảnh (từ camera hoặc thư viện)
 * @param onImageSelected Callback khi chọn ảnh thành công
 */
export const showImageSourceMenu = async (
  onImageSelected: (uri: string) => void
): Promise<void> => {
  try {
    // Chọn từ thư viện
    const libraryImage = await pickImageFromLibrary();
    if (libraryImage) {
      onImageSelected(libraryImage);
    }
  } catch (error) {
    console.error("Lỗi khi hiển thị menu chọn ảnh:", error);
  }
};
