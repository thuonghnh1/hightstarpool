import axiosInstance from "../../services/axiosInstance"; // Đường dẫn đến axiosInstance

const API_URL = "/admin/trainers"; // URL thực tế của bạn

// Hàm xử lý lỗi chung
const handleError = (error, message) => {
  console.error(message, error);
  throw error;
};

// Hàm lấy tất cả huấn luyện viên
const getTrainers = async () => {
  try {
    const response = await axiosInstance.get(API_URL);
    return response.data;
  } catch (error) {
    handleError(error, "Lỗi khi lấy danh sách huấn luyện viên:");
  }
};

// Hàm lấy một huấn luyện viên theo ID
const getTrainerById = async (id) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    handleError(error, `Lỗi khi lấy huấn luyện viên với ID: ${id}`);
  }
};

// Hàm thêm mới huấn luyện viên
const createTrainer = async (trainerData) => {
  try {
    const response = await axiosInstance.post(API_URL, trainerData);
    return response.data;
  } catch (error) {
    handleError(error, "Lỗi khi thêm mới huấn luyện viên:");
  }
};

// Hàm cập nhật thông tin huấn luyện viên
const updateTrainer = async (id, trainerData) => {
  try {
    const response = await axiosInstance.put(`${API_URL}/${id}`, trainerData);
    return response.data;
  } catch (error) {
    handleError(error, `Lỗi khi cập nhật huấn luyện viên với ID: ${id}`);
  }
};

// Hàm xóa huấn luyện viên
const deleteTrainer = async (id) => {
  try {
    await axiosInstance.delete(`${API_URL}/${id}`);
  } catch (error) {
    handleError(error, `Lỗi khi xóa huấn luyện viên với ID: ${id}`);
  }
};

// Gán tất cả các hàm vào một object trước khi export
const trainerService = {
  getTrainers,
  getTrainerById,
  createTrainer,
  updateTrainer,
  deleteTrainer,
};

export default trainerService;
