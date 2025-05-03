import { VStack, Button, Icon } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import BottomSheet from "@/components/BottomSheet";

const ImagePickerSheet = ({
  isOpen,
  onClose,
  onSelect,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (source: "camera" | "library") => void;
}) => {
  return (
    <BottomSheet isVisible={isOpen} onClose={onClose} snapPoints={[0.3]}>
      <VStack space={3} py={2}>
        <Button
          onPress={() => onSelect("camera")}
          variant="ghost"
          colorScheme="blueGray"
          width="full"
          leftIcon={<Icon as={Ionicons} name="camera" size="sm" />}
          justifyContent="flex-start"
          _text={{ fontSize: "md" }}
        >
          Chụp ảnh
        </Button>
        <Button
          onPress={() => onSelect("library")}
          variant="ghost"
          colorScheme="blueGray"
          width="full"
          leftIcon={<Icon as={Ionicons} name="images" size="sm" />}
          justifyContent="flex-start"
          _text={{ fontSize: "md" }}
        >
          Chọn từ thư viện
        </Button>
        <Button
          onPress={onClose}
          variant="ghost"
          colorScheme="danger"
          width="full"
          leftIcon={<Icon as={Ionicons} name="close-circle" size="sm" />}
          justifyContent="flex-start"
          _text={{ fontSize: "md" }}
        >
          Hủy
        </Button>
      </VStack>
    </BottomSheet>
  );
};

export default ImagePickerSheet;
