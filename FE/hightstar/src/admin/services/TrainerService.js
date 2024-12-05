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
const createTrainer = async (trainerData, file) => {
  const formData = new FormData(); // Gửi dữ liệu đa dạng với FormData
  formData.append("trainer", JSON.stringify(trainerData));
  if (file) {
    formData.append("file", file);
  }
  try {
    const response = await axiosInstance.post(API_URL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi thêm mới HLV:", error);
    throw error;
  }
};

// Hàm cập nhật thông tin huấn luyện viên
const updateTrainer = async (id, trainerData, file) => {
  const formData = new FormData();
  formData.append("trainer", JSON.stringify(trainerData));
  if (file) {
    formData.append("file", file);
  }
  try {
    const response = await axiosInstance.put(`${API_URL}/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi cập nhật HLV với ID: ${id}`, error);
    throw error;
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
