import axiosInstance from "../../services/axiosInstance";
import { formatDateTimeToDMY } from "../../admin/utils/FormatDate";
// Cấu hình URL API chung
const API_URL = "/user/notification";

// Hàm lấy tất cả thông báo
const getNotifications = async () => {
  try {
    const response = await axiosInstance.get(API_URL);
    const notifications = response.data;
    return notifications.map((notification) => ({
      ...notification,
      createdAt: formatDateTimeToDMY(notification.createdAt),
    }));
  } catch (error) {
    console.error("Lỗi khi lấy danh sách thông báo:", error);
    throw error;
  }
};

// Hàm lấy thông báo theo loại người nhận
const getNotificationsByRecipientType = async (recipientType) => {
  try {
    const response = await axiosInstance.get(
      `${API_URL}/by-recipient-type/${recipientType}`
    );
    const notifications = response.data;
    return notifications.map((notification) => ({
      ...notification,
      createdAt: formatDateTimeToDMY(notification.createdAt),
    }));
  } catch (error) {
    console.error(`Lỗi khi lấy thông báo theo loại ${recipientType}:`, error);
    throw error;
  }
};

// Export các hàm dưới dạng object
const NotificationService = {
  getNotifications,
  getNotificationsByRecipientType, // Export hàm mới
};

export default NotificationService;
