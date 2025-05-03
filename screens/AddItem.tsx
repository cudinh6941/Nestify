import React, { useMemo } from "react";
import DynamicForm from "@/components/DynamicForm";
import { ITEM_FORM_CONFIG } from "@/constants/formConfig";
import { useAddItemForm } from "@/hooks/useAddHouseholdItemForm";

const AddItem = () => {
  const form = useAddItemForm();

  // Xử lý khi field thay đổi
  const handleFieldChange = (name: string, value: any) => {
    switch (name) {
      case "name":
        form.setNameItem(value);
        break;

      case "category":
        form.setCategory(value);
        break;

      case "purchaseDate":
        form.setPurchaseDate(value);
        break;

      case "warrantyExpirationDate":
        form.setWarrantyExpirationDate(value);
        break;

      case "location":
        form.setLocation(value);
        break;

      case "price":
        if (typeof value === "number") {
          form.setPrice(value);
          form.setPriceText(value.toString());
        } else {
          form.setPrice(undefined);
          form.setPriceText("");
        }
        break;

      case "quantity":
        form.setQuantity(typeof value === "number" ? value : undefined);
        break;

      case "image":
        form.setSelectedImage(value);
        break;
    }
  };

  // Tạo cấu hình form với onSave từ hook
  const formConfig = {
    ...ITEM_FORM_CONFIG,
    onSave: form.handleSave, // Sử dụng handleSave từ hook
  };

  return (
    <DynamicForm formConfig={formConfig} onFieldChange={handleFieldChange} />
  );
};

export default AddItem;
