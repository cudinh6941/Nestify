/**
 * Các hàm tiện ích dùng để xác thực dữ liệu nhập
 */

/**
 * Kiểm tra xem một chuỗi có rỗng hay chỉ chứa khoảng trắng không
 * @param value Chuỗi cần kiểm tra
 * @returns true nếu chuỗi không rỗng, false nếu chuỗi rỗng hoặc chỉ chứa khoảng trắng
 */
export const isNotEmpty = (value: string): boolean => {
  return value.trim().length > 0;
};

/**
 * Kiểm tra xem một giá trị có phải là số hợp lệ không
 * @param value Giá trị cần kiểm tra
 * @returns true nếu là số hợp lệ, false nếu không
 */
export const isValidNumber = (value: string): boolean => {
  // Loại bỏ dấu phân cách hàng nghìn
  const numericValue = value.replace(/,/g, "");
  return !isNaN(Number(numericValue)) && numericValue.trim() !== "";
};

/**
 * Kiểm tra xem giá tiền có hợp lệ không
 * @param value Chuỗi giá tiền cần kiểm tra
 * @param min Giá trị tối thiểu (tùy chọn)
 * @param max Giá trị tối đa (tùy chọn)
 * @returns true nếu giá tiền hợp lệ, false nếu không
 */
export const isValidPrice = (
  value: string,
  min?: number,
  max?: number
): boolean => {
  // Loại bỏ dấu phân cách hàng nghìn
  const numericValue = value.replace(/,/g, "");

  // Kiểm tra có phải số không
  if (!isValidNumber(numericValue)) return false;

  // Chuyển đổi thành số để so sánh
  const numValue = Number(numericValue);

  // Kiểm tra giới hạn nếu được cung cấp
  if (min !== undefined && numValue < min) return false;
  if (max !== undefined && numValue > max) return false;

  return true;
};

/**
 * Tạo đối tượng chứa các thông báo lỗi cho form
 * @param values Đối tượng chứa các giá trị của form
 * @returns Đối tượng chứa các thông báo lỗi
 */
export interface ItemFormValues {
  name: string;
  category: string;
  location: string;
  price: string;
  [key: string]: any;
}

export interface FormErrors {
  name?: string;
  category?: string;
  location?: string;
  price?: string;
  [key: string]: string | undefined;
}

export const validateItemForm = (values: ItemFormValues): FormErrors => {
  const errors: FormErrors = {};

  // Kiểm tra tên
  if (!isNotEmpty(values.name)) {
    errors.name = "Vui lòng nhập tên đồ dùng";
  }

  // Kiểm tra danh mục
  if (!isNotEmpty(values.category)) {
    errors.category = "Vui lòng chọn danh mục";
  }

  // Kiểm tra vị trí
  if (!isNotEmpty(values.location)) {
    errors.location = "Vui lòng chọn vị trí";
  }

  // Kiểm tra giá tiền
  if (values.price && !isValidPrice(values.price)) {
    errors.price = "Giá tiền không hợp lệ";
  }

  return errors;
};

/**
 * Kiểm tra xem form có hợp lệ không
 * @param values Đối tượng chứa các giá trị của form
 * @returns true nếu form hợp lệ, false nếu không
 */
export const isFormValid = (values: ItemFormValues): boolean => {
  const errors = validateItemForm(values);
  return Object.keys(errors).length === 0;
};
