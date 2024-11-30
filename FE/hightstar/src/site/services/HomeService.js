import axiosInstance from "../../services/axiosInstance"; // Đường dẫn tới file axiosInstance

// Cấu hình URL API chung
const API_URL = "/public";

// Hàm lấy tất cả khóa học
const getCourses = async () => {
  try {
    const response = await axiosInstance.get(`${API_URL}/course`);
    return response.data; // Trả về dữ liệu khóa học
  } catch (error) {
    console.error("Lỗi khi lấy danh sách khóa học:", error);
    throw error; // Ném lỗi để các component gọi hàm này có thể xử lý tiếp
  }
};

// Hàm lấy một khóa học theo ID
const getCourseById = async (id) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/course/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi lấy khóa học với ID: ${id}`, error);
    throw error;
  }
};

// Hàm lấy tất cả huấn luyện viên
const getTrainers = async () => {
  try {
    const response = await axiosInstance.get(`${API_URL}/trainer`);
    return response.data;
  } catch (error) {
    handleError(error, "Lỗi khi lấy danh sách huấn luyện viên:");
  }
};

// Hàm lấy một huấn luyện viên theo ID
const getTrainerById = async (id) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/trainer/${id}`);
    return response.data;
  } catch (error) {
    handleError(error, `Lỗi khi lấy huấn luyện viên với ID: ${id}`);
  }
};

const HomeService = {
  getCourses,
  getCourseById,
};

export default HomeService;
