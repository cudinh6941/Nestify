/**
 * Các hàm tiện ích liên quan đến ngày tháng trong ứng dụng
 */
import { Platform } from "react-native";

/**
 * Tạo một đối tượng DateTimePickerOptions dựa trên nền tảng
 * @returns Cấu hình mặc định cho DateTimePicker
 */
export const getDefaultDatePickerOptions = () => {
  return {
    mode: "date" as const,
    display:
      Platform.OS === "ios" ? ("spinner" as const) : ("default" as const),
  };
};

/**
 * Tính toán ngày hết hạn bảo hành mặc định dựa trên ngày mua
 * @param purchaseDate Ngày mua
 * @param warrantyYears Số năm bảo hành (mặc định là 2)
 * @returns Ngày hết hạn bảo hành
 */
export const calculateDefaultWarrantyDate = (
  purchaseDate: Date,
  warrantyYears: number = 2
): Date => {
  const warrantyDate = new Date(purchaseDate);
  warrantyDate.setFullYear(purchaseDate.getFullYear() + warrantyYears);
  return warrantyDate;
};

/**
 * Kiểm tra xem ngày có hợp lệ không
 * @param date Đối tượng Date cần kiểm tra
 * @returns true nếu hợp lệ, false nếu không
 */
export const isValidDate = (date: Date): boolean => {
  return !isNaN(date.getTime());
};

/**
 * Chuyển đổi chuỗi ngày dạng "DD/MM/YYYY" thành đối tượng Date
 * @param dateString Chuỗi ngày dạng "DD/MM/YYYY"
 * @returns Đối tượng Date hoặc null nếu không hợp lệ
 */
export const parseDateString = (dateString: string): Date | null => {
  const parts = dateString.split("/");
  if (parts.length !== 3) return null;

  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // Tháng trong JS bắt đầu từ 0
  const year = parseInt(parts[2], 10);

  const date = new Date(year, month, day);

  // Kiểm tra xem ngày có hợp lệ không
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
};

/**
 * So sánh hai ngày
 * @param date1 Ngày thứ nhất
 * @param date2 Ngày thứ hai
 * @returns 0 nếu bằng nhau, -1 nếu date1 < date2, 1 nếu date1 > date2
 */
export const compareDates = (date1: Date, date2: Date): number => {
  const time1 = date1.setHours(0, 0, 0, 0);
  const time2 = date2.setHours(0, 0, 0, 0);

  if (time1 === time2) return 0;
  return time1 < time2 ? -1 : 1;
};

/**
 * Kiểm tra xem ngày có phải là ngày trong tương lai không
 * @param date Ngày cần kiểm tra
 * @returns true nếu là ngày trong tương lai, false nếu không
 */
export const isFutureDate = (date: Date): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);
  return date > today;
};
