import React from "react";
import DynamicForm from "@/components/DynamicForm";
import { PET_FORM_CONFIG } from "@/constants/formConfig";
import { useAddPetForm } from "@/hooks/useAddPet";

const AddPetScreen: React.FC = () => {
  const form = useAddPetForm();

  // Xử lý khi field thay đổi
  const handleFieldChange = (name: string, value: any) => {
    switch (name) {
      case "name":
        form.setName(value);
        break;

      case "species":
        form.setSpecies(value);
        break;

      case "breed":
        form.setBreed(value);
        break;

      case "birthDate":
        form.setBirthDate(value);
        break;

      case "gender":
        form.setGender(value);
        break;

      case "weight":
        form.setWeight(typeof value === "number" ? value : undefined);
        break;

      case "nextVaccineDate":
        form.setNextVaccineDate(value);
        break;

      case "nextCheckupDate":
        form.setNextCheckupDate(value);
        break;

      case "spayedNeutered":
        form.setSpayedNeutered(value);
        break;

      case "feedingFrequency":
        form.setFeedingFrequency(value);
        break;

      case "notes":
        form.setNotes(value);
        break;

      case "image":
        form.setSelectedImage(value);
        break;
    }
  };

  return (
    <DynamicForm
      formConfig={{
        ...PET_FORM_CONFIG,
        onSave: form.handleSave,
      }}
      onFieldChange={handleFieldChange}
    />
  );
};

export default AddPetScreen;
