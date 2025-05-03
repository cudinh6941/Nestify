// utils/initialData.ts - Dữ liệu khởi tạo cho ứng dụng
import { useRealm } from "@/Context/RealmProvider";
import { BSON } from "realm";

/**
 * Khởi tạo các danh mục hệ thống và dữ liệu mặc định
 */
export const initializeSystemData = () => {
  const realm = useRealm();

  return new Promise<void>((resolve, reject) => {
    try {
      realm.write(() => {
        // Kiểm tra xem đã có danh mục nào chưa
        const existingCategories = realm.objects("Category");
        if (existingCategories.length > 0) {
          console.log("Đã có dữ liệu danh mục, bỏ qua khởi tạo.");
          resolve();
          return;
        }

        // Tạo danh mục hệ thống
        const householdItemsCategory = realm.create("Category", {
          id: new BSON.UUID().toHexString(),
          name: "Đồ dùng",
          icon: "furniture",
          description: "Các vật dụng trong nhà",
          isSystem: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        const petsCategory = realm.create("Category", {
          id: new BSON.UUID().toHexString(),
          name: "Vật nuôi",
          icon: "pets",
          description: "Thú cưng và động vật nuôi",
          isSystem: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        const plantsCategory = realm.create("Category", {
          id: new BSON.UUID().toHexString(),
          name: "Cây cối",
          icon: "plant",
          description: "Cây trồng trong và ngoài nhà",
          isSystem: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        const vehiclesCategory = realm.create("Category", {
          id: new BSON.UUID().toHexString(),
          name: "Phương tiện",
          icon: "car",
          description: "Xe cộ và phương tiện di chuyển",
          isSystem: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        const documentsCategory = realm.create("Category", {
          id: new BSON.UUID().toHexString(),
          name: "Tài liệu",
          icon: "file-document",
          description: "Giấy tờ và tài liệu quan trọng",
          isSystem: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        const healthCategory = realm.create("Category", {
          id: new BSON.UUID().toHexString(),
          name: "Sức khỏe",
          icon: "heart-pulse",
          description: "Thông tin sức khỏe gia đình",
          isSystem: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        const financeCategory = realm.create("Category", {
          id: new BSON.UUID().toHexString(),
          name: "Tài chính",
          icon: "cash",
          description: "Quản lý chi tiêu và khoản vay",
          isSystem: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        const projectsCategory = realm.create("Category", {
          id: new BSON.UUID().toHexString(),
          name: "Dự án gia đình",
          icon: "hammer",
          description: "Các dự án cải tạo và sự kiện",
          isSystem: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        // Tạo các danh mục con
        // Đồ dùng
        realm.create("Category", {
          id: new BSON.UUID().toHexString(),
          name: "Đồ điện tử",
          icon: "television",
          description: "Các thiết bị điện tử",
          isSystem: true,
          parentCategoryId: householdItemsCategory.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        realm.create("Category", {
          id: new BSON.UUID().toHexString(),
          name: "Đồ bếp",
          icon: "pot",
          description: "Dụng cụ và thiết bị nhà bếp",
          isSystem: true,
          parentCategoryId: householdItemsCategory.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        realm.create("Category", {
          id: new BSON.UUID().toHexString(),
          name: "Đồ nội thất",
          icon: "sofa",
          description: "Bàn ghế và đồ nội thất",
          isSystem: true,
          parentCategoryId: householdItemsCategory.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        // Vật nuôi
        realm.create("Category", {
          id: new BSON.UUID().toHexString(),
          name: "Chó",
          icon: "dog",
          description: "Thú cưng loài chó",
          isSystem: true,
          parentCategoryId: petsCategory.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        realm.create("Category", {
          id: new BSON.UUID().toHexString(),
          name: "Mèo",
          icon: "cat",
          description: "Thú cưng loài mèo",
          isSystem: true,
          parentCategoryId: petsCategory.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        realm.create("Category", {
          id: new BSON.UUID().toHexString(),
          name: "Cá",
          icon: "fish",
          description: "Cá cảnh",
          isSystem: true,
          parentCategoryId: petsCategory.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        // Cây cối
        realm.create("Category", {
          id: new BSON.UUID().toHexString(),
          name: "Cây trong nhà",
          icon: "flower",
          description: "Cây trồng trong nhà",
          isSystem: true,
          parentCategoryId: plantsCategory.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        realm.create("Category", {
          id: new BSON.UUID().toHexString(),
          name: "Cây ngoài vườn",
          icon: "tree",
          description: "Cây trồng ngoài vườn",
          isSystem: true,
          parentCategoryId: plantsCategory.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        realm.create("Category", {
          id: new BSON.UUID().toHexString(),
          name: "Rau củ",
          icon: "leaf",
          description: "Rau củ tự trồng",
          isSystem: true,
          parentCategoryId: plantsCategory.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        // Phương tiện
        realm.create("Category", {
          id: new BSON.UUID().toHexString(),
          name: "Ô tô",
          icon: "car",
          description: "Xe ô tô",
          isSystem: true,
          parentCategoryId: vehiclesCategory.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        realm.create("Category", {
          id: new BSON.UUID().toHexString(),
          name: "Xe máy",
          icon: "motorbike",
          description: "Xe máy và xe ga",
          isSystem: true,
          parentCategoryId: vehiclesCategory.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        realm.create("Category", {
          id: new BSON.UUID().toHexString(),
          name: "Xe đạp",
          icon: "bicycle",
          description: "Xe đạp",
          isSystem: true,
          parentCategoryId: vehiclesCategory.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        // Tài liệu
        realm.create("Category", {
          id: new BSON.UUID().toHexString(),
          name: "Hộ chiếu & CMND",
          icon: "card-account-details",
          description: "Giấy tờ tùy thân",
          isSystem: true,
          parentCategoryId: documentsCategory.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        realm.create("Category", {
          id: new BSON.UUID().toHexString(),
          name: "Hợp đồng",
          icon: "file-document-edit",
          description: "Các loại hợp đồng",
          isSystem: true,
          parentCategoryId: documentsCategory.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        realm.create("Category", {
          id: new BSON.UUID().toHexString(),
          name: "Bảo hiểm",
          icon: "shield-account",
          description: "Giấy tờ bảo hiểm",
          isSystem: true,
          parentCategoryId: documentsCategory.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        // Sức khỏe
        realm.create("Category", {
          id: new BSON.UUID().toHexString(),
          name: "Khám định kỳ",
          icon: "doctor",
          description: "Lịch khám sức khỏe định kỳ",
          isSystem: true,
          parentCategoryId: healthCategory.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        realm.create("Category", {
          id: new BSON.UUID().toHexString(),
          name: "Thuốc",
          icon: "pill",
          description: "Thuốc và đơn thuốc",
          isSystem: true,
          parentCategoryId: healthCategory.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        realm.create("Category", {
          id: new BSON.UUID().toHexString(),
          name: "Tiêm chủng",
          icon: "needle",
          description: "Lịch tiêm chủng",
          isSystem: true,
          parentCategoryId: healthCategory.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        // Tài chính
        realm.create("Category", {
          id: new BSON.UUID().toHexString(),
          name: "Chi tiêu hàng ngày",
          icon: "cart",
          description: "Chi tiêu thường ngày",
          isSystem: true,
          parentCategoryId: financeCategory.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        realm.create("Category", {
          id: new BSON.UUID().toHexString(),
          name: "Khoản vay",
          icon: "bank",
          description: "Các khoản vay và nợ",
          isSystem: true,
          parentCategoryId: financeCategory.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        realm.create("Category", {
          id: new BSON.UUID().toHexString(),
          name: "Tiết kiệm",
          icon: "piggy-bank",
          description: "Khoản tiết kiệm",
          isSystem: true,
          parentCategoryId: financeCategory.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        // Dự án gia đình
        realm.create("Category", {
          id: new BSON.UUID().toHexString(),
          name: "Sửa chữa nhà",
          icon: "home-repair",
          description: "Dự án sửa chữa nhà cửa",
          isSystem: true,
          parentCategoryId: projectsCategory.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        realm.create("Category", {
          id: new BSON.UUID().toHexString(),
          name: "Sự kiện gia đình",
          icon: "calendar-star",
          description: "Các sự kiện gia đình",
          isSystem: true,
          parentCategoryId: projectsCategory.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        console.log("Đã khởi tạo dữ liệu danh mục thành công");
        resolve();
      });
    } catch (error) {
      console.error("Lỗi khi khởi tạo dữ liệu:", error);
      reject(error);
    }
  });
};

// Hàm khởi tạo user mặc định nếu chưa có
export const initializeDefaultUser = () => {
  const realm = useRealm();

  return new Promise<string>((resolve, reject) => {
    try {
      realm.write(() => {
        // Kiểm tra xem đã có user nào chưa
        const existingUsers = realm.objects("User");
        if (existingUsers.length > 0) {
          console.log("Đã có dữ liệu người dùng, bỏ qua khởi tạo.");
          resolve((existingUsers[0] as unknown as { id: string }).id);
          return;
        }

        // Tạo user mặc định
        const defaultUser = realm.create("User", {
          id: new BSON.UUID().toHexString(),
          fullName: "Nguyễn Văn A",
          email: "user@example.com",
          location: "Hà Nội",
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        // Tạo user preferences
        realm.create("UserPreference", {
          id: new BSON.UUID().toHexString(),
          userId: defaultUser.id,
          theme: "light",
          dashboardLayout: JSON.stringify({
            topWidgets: ["tasks", "reminders", "expiring"],
            bottomWidgets: ["recent", "budget", "weather"],
          }),
          notificationSettings: JSON.stringify({
            enablePush: true,
            enableEmail: false,
            reminderTime: "08:00",
          }),
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        console.log("Đã khởi tạo dữ liệu người dùng mặc định thành công");
        resolve(defaultUser.id);
      });
    } catch (error) {
      console.error("Lỗi khi khởi tạo dữ liệu người dùng:", error);
      reject(error);
    }
  });
};

// Khởi tạo tất cả dữ liệu cần thiết
export const initializeAllData = async () => {
  try {
    await initializeSystemData();
    const userId = await initializeDefaultUser();
    return userId;
  } catch (error) {
    console.error("Lỗi khởi tạo dữ liệu:", error);
    throw error;
  }
};
