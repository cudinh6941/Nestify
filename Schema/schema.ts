// User Schema
export const UserSchema = {
  name: "User",
  primaryKey: "id",
  properties: {
    id: "string", // PK
    fullName: "string",
    email: "string?",
    phone: "string?",
    passwordHash: "string?",
    preferences: "string?", // JSON string cho cài đặt người dùng (themes, notifications settings)
    createdAt: "date",
    updatedAt: "date",
  },
};

// Entity Schema - Bảng chính chứa tất cả các loại thực thể
export const EntitySchema = {
  name: "Entity",
  primaryKey: "id",
  properties: {
    id: "string", // PK
    userId: "string", // FK tới User
    categoryId: "string", // FK tới Category
    type: "string",
    name: "string",
    description: "string?",
    attributes: "string?", // JSON string, chứa fields đặc thù từng loại

    // Các trường quan trọng cho thông báo - được trích xuất từ attributes
    expiryDate: "date?", // Ngày hết hạn (giấy tờ, thực phẩm...)
    nextServiceDate: "date?", // Ngày bảo trì tiếp theo (xe, thiết bị)
    nextCareDate: "date?", // Ngày chăm sóc tiếp theo (thú cưng, cây cối)
    reminderDates: "string?", // JSON array các ngày cần nhắc nhở khác

    // Trường cơ bản khác
    quantity: { type: "int", default: 1 },
    location: "string?",
    imageUrl: "string?",
    status: "string?", // active, expired, etc.

    createdAt: "date",
    updatedAt: "date",
  },
  // Indexes cho truy vấn hiệu quả
  // indexes: [
  //   "userId",
  //   "categoryId",
  //   "expiryDate",
  //   "nextServiceDate",
  //   "nextCareDate",
  // ],
};

// CareRecord Schema - Lịch sử chăm sóc
export const CareRecordSchema = {
  name: "CareRecord",
  primaryKey: "id",
  properties: {
    id: "string", // PK
    userId: "string", // FK tới User
    entityId: "string", // FK tới Entity
    careType: "string", // watering, feeding, vaccination, oil_change, etc.
    notes: "string?",
    cost: "double?",
    timestamp: "date",
    nextCareDate: "date?", // Ngày chăm sóc tiếp theo
    createdAt: "date",
  },
};

// Notification Schema - Thông báo
export const NotificationSchema = {
  name: "Notification",
  primaryKey: "id",
  properties: {
    id: "string", // PK
    userId: "string", // FK tới User
    title: "string",
    message: "string?",
    entityId: "string?", // FK tới Entity liên quan
    entityType: "string?", // Loại Entity liên quan
    triggerDate: "date", // Khi nào sẽ hiển thị thông báo
    priority: { type: "int", default: 0 }, // 0: normal, 1: important, 2: urgent
    sent: { type: "bool", default: false }, // Đã gửi hay chưa
    read: { type: "bool", default: false }, // Đã đọc hay chưa
    type: "string", // expiry_warning, care_reminder, etc.
    recurrenceRule: "string?", // Quy tắc lặp lại (nếu là thông báo định kỳ)
    data: "string?", // JSON data bổ sung
    createdAt: "date",
    updatedAt: "date",
  },
  // Indexes cho truy vấn hiệu quả
  // indexes: ["userId", "sent", "read", "triggerDate"],
};

// Activity Schema - Nhật ký hoạt động
export const ActivitySchema = {
  name: "Activity",
  primaryKey: "id",
  properties: {
    id: "string", // PK
    userId: "string", // FK tới User
    action: "string", // create, update, delete, etc.
    entityId: "string?", // FK tới entity liên quan
    entityType: "string?", // Loại entity liên quan
    description: "string?",
    timestamp: "date",
  },
};

// NotificationRule Schema - Quy tắc tạo thông báo tự động
export const NotificationRuleSchema = {
  name: "NotificationRule",
  primaryKey: "id",
  properties: {
    id: "string", // PK
    userId: "string", // FK tới User
    name: "string", // Tên quy tắc
    entityType: "string?", // Loại entity áp dụng (pet, plant, vehicle, etc.)
    categoryId: "string?", // Danh mục áp dụng
    event: "string", // Sự kiện kích hoạt (expiry, service_due, care_needed, etc.)
    daysInAdvance: { type: "int", default: 3 }, // Số ngày thông báo trước sự kiện
    title: "string", // Mẫu tiêu đề thông báo
    message: "string", // Mẫu nội dung thông báo
    priority: { type: "int", default: 0 }, // Ưu tiên thông báo
    isActive: { type: "bool", default: true }, // Kích hoạt hay không
    createdAt: "date",
    updatedAt: "date",
  },
};

// Task Schema - Công việc, nhiệm vụ
export const TaskSchema = {
  name: "Task",
  primaryKey: "id",
  properties: {
    id: "string", // PK
    userId: "string", // FK tới User
    title: "string",
    description: "string?",
    dueDate: "date?",
    completedAt: "date?",
    priority: { type: "int", default: 0 }, // 0: normal, 1: important, 2: urgent
    status: "string", // pending, completed, cancelled
    entityId: "string?", // FK tới Entity nếu liên quan
    reminderDate: "date?", // Thời gian nhắc nhở
    createdAt: "date",
    updatedAt: "date",
  },
  // Indexes cho truy vấn hiệu quả
  // indexes: ["userId", "status", "dueDate", "reminderDate"],
};
