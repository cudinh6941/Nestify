export interface CategoryItem {
  id: string;
  title: string;
  description: string;
  iconType: "MaterialIcons" | "FontAwesome5" | "MaterialCommunityIcons";
  iconName: string;
  color: string;
}
export const CATEGORIES: CategoryItem[] = [
  {
    id: "furniture",
    title: "Đồ dùng",
    description: "Thêm vật phẩm mới vào nhà",
    iconType: "MaterialIcons",
    iconName: "chair",
    color: "#4CAF50",
  },
  {
    id: "pet",
    title: "Vật nuôi",
    description: "Thêm thú cưng mới",
    iconType: "FontAwesome5",
    iconName: "paw",
    color: "#FF9800",
  },
  {
    id: "plant",
    title: "Cây cối",
    description: "Thêm cây mới vào vườn",
    iconType: "MaterialCommunityIcons",
    iconName: "sprout",
    color: "#2196F3",
  },
  {
    id: "expense",
    title: "Chi tiêu",
    description: "Thêm khoản chi mới",
    iconType: "MaterialCommunityIcons",
    iconName: "cash",
    color: "#F44336",
  },
];
export const CATEGORY_DISPLAY_CONFIG = {
  HouseholdItem: {
    id: "furniture",
    type: "furniture",
    title: "Đồ dùng",
    countLabel: "vật phẩm",
    iconType: "MaterialIcons",
    iconName: "chair",
    schemaName: "HouseholdItem",
  },
  Pet: {
    id: "pet",
    type: "pet",
    title: "Vật nuôi",
    countLabel: "thú cưng",
    iconType: "FontAwesome5",
    iconName: "cat",
    schemaName: "Pet",
  },
  Plant: {
    id: "plant",
    type: "plant",
    title: "Cây cối",
    countLabel: "cây",
    iconType: "MaterialCommunityIcons",
    iconName: "sprout",
    schemaName: "Plant",
  },
  Expense: {
    id: "expense",
    type: "expense",
    title: "Chi tiêu",
    countLabel: "khoản",
    iconType: "MaterialCommunityIcons",
    iconName: "cash",
    schemaName: "Expense",
  },
};
