import { useState, useRef } from "react";
import { useToast } from "@/Context/ToastProvider";
import { ImagePickerMethods } from "@/components/ImagePicker";
import { useRealmUtils } from "./useReamUtils";
import { ENTITY_TYPES } from "@/constants/common";

export const useAddItemForm = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [nameItem, setNameItem] = useState("");
  const [category, setCategory] = useState("");
  const [purchaseDate, setPurchaseDate] = useState(new Date());
  const [warrantyExpirationDate, setWarrantyExpirationDate] = useState(
    new Date()
  );
  const [location, setLocation] = useState("");
  const [priceText, setPriceText] = useState("");
  const [price, setPrice] = useState<number>();
  const [quantity, setQuantity] = useState<number>();
  const imagePickerRef = useRef<ImagePickerMethods>(null);

  const toast = useToast();
  const { createEntity } = useRealmUtils();

  const resetForm = () => {
    setNameItem("");
    setCategory("");
    setPurchaseDate(new Date());
    setWarrantyExpirationDate(new Date());
    setLocation("");
    setPriceText("");
    setPrice(undefined);
    setQuantity(undefined);
    setSelectedImage(null);
  };

  const handleSave = () => {
    if (!nameItem.trim()) {
      toast.show("Vui lòng nhập tên đồ dùng", "error");
      return;
    }
    try {
      const attributes = {
        price: price,
        purchaseDate: purchaseDate,
        warrantyExpirationDate: warrantyExpirationDate,
        location: location,
        quantity: quantity,
      };
      createEntity("Entity", {
        name: nameItem,
        type: ENTITY_TYPES.HOUSEHOLD_ITEM,
        categoryId: category || undefined,
        expiryDate: warrantyExpirationDate, // Trường riêng cho thông báo
        attributes: JSON.stringify(attributes), // Lưu trữ dữ liệu đặc thù
        quantity: quantity || 1,
        imageUrl: selectedImage || undefined,
        userId: "current_user_id",
        // Thêm các trường bắt buộc khác
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      toast.show("Đã lưu thành công", "success");
      resetForm();
    } catch (error) {
      console.error(error);
      toast.show("Có lỗi xảy ra khi lưu", "error");
    }
  };

  return {
    selectedImage,
    setSelectedImage,
    nameItem,
    setNameItem,
    category,
    setCategory,
    purchaseDate,
    setPurchaseDate,
    warrantyExpirationDate,
    setWarrantyExpirationDate,
    location,
    setLocation,
    priceText,
    setPriceText,
    price,
    setPrice,
    quantity,
    setQuantity,
    imagePickerRef,
    handleSave,
  };
};
