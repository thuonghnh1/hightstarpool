import axiosInstance from "../../services/axiosInstance";
// Cấu hình URL API chung
const API_URL = "/user/notification";

// Hàm lấy thông báo theo loại người nhận
const getNotificationsByRecipientType = async (recipientType) => {
  try {
    const response = await axiosInstance.get(
      `${API_URL}/by-recipient-type/${recipientType}`
    );
    const notifications = response.data;
    return notifications.map((notification) => ({
      ...notification,
    }));
  } catch (error) {
    console.error(`Lỗi khi lấy thông báo theo loại ${recipientType}:`, error);
    throw error;
  }
};

// Hàm cập nhật trạng thái thông báo
const updateNotificationStatus = async (notificationId, status) => {
  try {
    const response = await axiosInstance.put(
      `${API_URL}/${notificationId}/status`,
      { status }
    );
    return response.data; // Nếu cần, trả về thông báo đã cập nhật
  } catch (error) {
    console.error(
      `Lỗi khi cập nhật trạng thái thông báo ID ${notificationId}:`,
      error
    );
    throw error;
  }
};

// Hàm tìm thông báo theo userId
const getNotificationsByUserId = async (userId) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/by-user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy thông báo theo userId:", error);
    throw error;
  }
};

// Export các hàm dưới dạng object
const NotificationService = {
  getNotificationsByRecipientType,
  updateNotificationStatus,
  getNotificationsByUserId,
};

export default NotificationService;
