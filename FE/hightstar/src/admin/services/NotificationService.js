import axiosInstance from "../../services/axiosInstance"; // Đường dẫn tới file axiosInstance
import { formatDateTimeToDMY } from "../utils/FormatDate";

// Cấu hình URL API chung
const API_URL = "/admin/notification";

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

// Hàm lấy một thông báo theo ID
const getNotificationById = async (id) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/${id}`);
    return {
      ...response.data,
      createdAt: formatDateTimeToDMY(response.data.createdAt),
    }; // Trả về thông báo theo ID
  } catch (error) {
    console.error(`Lỗi khi lấy thông báo với ID: ${id}`, error);
    throw error;
  }
};

// Hàm tạo thông báo mới
const createNotification = async (notificationData) => {
  try {
    const response = await axiosInstance.post(API_URL, notificationData);
    return response.data; // Trả về thông báo đã tạo
  } catch (error) {
    console.error("Lỗi khi thêm mới thông báo:", error);
    throw error;
  }
};

// Hàm cập nhật thông báo
const updateNotification = async (id, notificationData) => {
  try {
    const response = await axiosInstance.put(
      `${API_URL}/${id}`,
      notificationData
    );
    return response.data; // Trả về thông báo đã cập nhật
  } catch (error) {
    console.error(`Lỗi khi cập nhật thông báo với ID: ${id}`, error);
    throw error;
  }
};

// Hàm xóa thông báo
const deleteNotification = async (id) => {
  try {
    await axiosInstance.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error(`Lỗi khi xóa thông báo với ID: ${id}`, error);
    throw error;
  }
};

// Export các hàm dưới dạng object
const NotificationService = {
  getNotifications,
  getNotificationById,
  createNotification,
  updateNotification,
  deleteNotification,
};

export default NotificationService;
