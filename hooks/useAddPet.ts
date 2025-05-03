import { useState, useRef } from "react";
import { useToast } from "@/Context/ToastProvider";
import { ImagePickerMethods } from "@/components/ImagePicker";
import { useRealmUtils } from "./useReamUtils";
import { ENTITY_TYPES } from "@/constants/common";

export const useAddPetForm = () => {
  // Các trạng thái cơ bản cho vật nuôi
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [breed, setBreed] = useState("");
  const [birthDate, setBirthDate] = useState(new Date());
  const [gender, setGender] = useState("");
  const [weight, setWeight] = useState<number>();
  const [nextVaccineDate, setNextVaccineDate] = useState(new Date());
  const [nextCheckupDate, setNextCheckupDate] = useState(new Date());
  const [spayedNeutered, setSpayedNeutered] = useState("");
  const [feedingFrequency, setFeedingFrequency] = useState("");
  const [notes, setNotes] = useState("");

  const imagePickerRef = useRef<ImagePickerMethods>(null);

  const toast = useToast();
  const { createEntity } = useRealmUtils();

  // Reset form
  const resetForm = () => {
    setSelectedImage(null);
    setName("");
    setSpecies("");
    setBreed("");
    setBirthDate(new Date());
    setGender("");
    setWeight(undefined);
    setNextVaccineDate(new Date());
    setNextCheckupDate(new Date());
    setSpayedNeutered("");
    setFeedingFrequency("");
    setNotes("");
  };

  // Xử lý lưu dữ liệu
  const handleSave = () => {
    if (!name.trim()) {
      toast.show("Vui lòng nhập tên vật nuôi", "error");
      return;
    }

    try {
      const attributes = {
        species,
        breed,
        birthDate,
        gender,
        weight,
        nextVaccineDate,
        nextCheckupDate,
        spayedNeutered,
        feedingFrequency,
        notes,
      };

      createEntity("Entity", {
        name: name,
        type: ENTITY_TYPES.PET,
        categoryId: species || undefined,
        // Có thể sử dụng ngày vaccine tiếp theo làm ngày hết hạn
        expiryDate: nextVaccineDate,
        attributes: JSON.stringify(attributes),
        imageUrl: selectedImage || undefined,
        userId: "current_user_id",
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

  // Xử lý lưu dữ liệu từ DynamicForm

  return {
    // Trả về các giá trị trạng thái
    selectedImage,
    setSelectedImage,
    name,
    setName,
    species,
    setSpecies,
    breed,
    setBreed,
    birthDate,
    setBirthDate,
    gender,
    setGender,
    weight,
    setWeight,
    nextVaccineDate,
    setNextVaccineDate,
    nextCheckupDate,
    setNextCheckupDate,
    spayedNeutered,
    setSpayedNeutered,
    feedingFrequency,
    setFeedingFrequency,
    notes,
    setNotes,
    imagePickerRef,

    // Các hàm
    handleSave,
    resetForm,

    // Các tiện ích
    toast,
    createEntity,
  };
};
