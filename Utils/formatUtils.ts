/**
 * Các hàm tiện ích dùng cho định dạng dữ liệu trong ứng dụng
 */

/**
 * Định dạng ngày thành chuỗi DD/MM/YYYY
 * @param date Đối tượng Date cần định dạng
 * @returns Chuỗi ngày đã định dạng
 */
export const formatDate = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

/**
 * Định dạng số thành chuỗi có dấu phân cách hàng nghìn
 * @param value Chuỗi hoặc số cần định dạng
 * @returns Chuỗi đã định dạng với dấu phân cách hàng nghìn
 */
export const formatPrice = (value: string | number): string => {
  // Chuyển đổi về chuỗi nếu đầu vào là số
  const stringValue = typeof value === "number" ? value.toString() : value;

  // Loại bỏ tất cả ký tự không phải số
  const numericValue = stringValue.replace(/[^0-9]/g, "");

  // Thêm dấu phân cách hàng nghìn
  return numericValue ? numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "";
};

/**
 * Chuyển đổi chuỗi định dạng tiền tệ thành số
 * @param formattedValue Chuỗi tiền đã định dạng (có dấu phân cách)
 * @returns Số nguyên
 */
export const parsePriceToNumber = (formattedValue: string): number => {
  // Loại bỏ tất cả ký tự không phải số
  const numericString = formattedValue.replace(/[^0-9]/g, "");
  return numericString ? parseInt(numericString, 10) : 0;
};

/**
 * Thêm năm vào ngày hiện tại
 * @param years Số năm cần thêm (có thể là số âm)
 * @returns Đối tượng Date mới
 */
export const addYearsToDate = (date: Date, years: number): Date => {
  const newDate = new Date(date);
  newDate.setFullYear(newDate.getFullYear() + years);
  return newDate;
};

/**
 * Tạo một chuỗi định danh duy nhất
 * @returns Chuỗi ID duy nhất
 */
export const generateUniqueId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};

/**
 * Rút gọn chuỗi với dấu chấm lửng nếu quá dài
 * @param text Chuỗi đầu vào
 * @param maxLength Độ dài tối đa
 * @returns Chuỗi đã rút gọn
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
};

export const formatCurrency = (amount?: number): string => {
  if (amount === undefined || amount === null) return "Không có giá";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(amount);
};
