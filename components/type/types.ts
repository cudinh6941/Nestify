export interface HouseholdItem {
  id: string;
  userId: string;
  categoryId?: string;
  name: string;
  quantity?: number;
  purchaseDate?: Date;
  warrantyExpirationDate?: Date;
  locationId?: string;
  price?: number;
  status?: string;
  notes?: string;
  imageUri?: string;
  remindWarranty?: boolean;
  remindMaintenance?: boolean;
  createdAt: Date;
  updatedAt: Date;
}
export type ToastType = "success" | "error" | "info" | "warning";

export type RootStackParamList = {
  MainTabs: undefined;
  AddMenu: undefined;
};

// Module đồ dùng
export type ItemStackParamList = {
  household: undefined;
  pet: undefined;
  householdDetail: { itemId: string };
};

// Module thú cưng
export type AddStackParamList = {
  AddPetScreen: undefined;
  AddHouseHold: undefined;

  // Các màn hình thú cưng khác
};

// Tổng hợp tất cả để sử dụng cho navigator chính
export type FullStackParamList = RootStackParamList &
  ItemStackParamList &
  AddStackParamList;
