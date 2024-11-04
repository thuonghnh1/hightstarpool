import axios from "axios";

// Cấu hình axios với URL API chung
const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api/trainers",
  // headers: { Authorization: "Bearer <your_token>" }, // Nếu cần thêm mã thông báo
});

// Hàm xử lý lỗi chung
const handleError = (error, message) => {
  console.error(message, error);
  throw error;
};

// Hàm lấy tất cả huấn luyện viên
const getTrainers = async () => {
  try {
    const response = await axiosInstance.get("");
    return response.data;
  } catch (error) {
    handleError(error, "Lỗi khi lấy danh sách huấn luyện viên:");
  }
};

// Hàm lấy một huấn luyện viên theo ID
const getTrainerById = async (id) => {
  try {
    const response = await axiosInstance.get(`/${id}`);
    return response.data;
  } catch (error) {
    handleError(error, `Lỗi khi lấy huấn luyện viên với ID: ${id}`);
  }
};

// Hàm thêm mới huấn luyện viên
const createTrainer = async (trainerData) => {
  try {
    const response = await axiosInstance.post("", trainerData);
    return response.data;
  } catch (error) {
    handleError(error, "Lỗi khi thêm mới huấn luyện viên:");
  }
};

// Hàm cập nhật thông tin huấn luyện viên
const updateTrainer = async (id, trainerData) => {
  try {
    const response = await axiosInstance.put(`/${id}`, trainerData);
    return response.data;
  } catch (error) {
    handleError(error, `Lỗi khi cập nhật huấn luyện viên với ID: ${id}`);
  }
};

// Hàm xóa huấn luyện viên
const deleteTrainer = async (id) => {
  try {
    await axiosInstance.delete(`/${id}`);
  } catch (error) {
    handleError(error, `Lỗi khi xóa huấn luyện viên với ID: ${id}`);
  }
};

const trainerService = {
  getTrainers,
  getTrainerById,
  createTrainer,
  updateTrainer,
  deleteTrainer,
};

export default trainerService;
