import axiosInstance from "../../services/axiosInstance"; // Đường dẫn tới file axiosInstance

// Cấu hình URL API chung
const API_URL = "/employee/enrollments";

// Hàm lấy tất cả danh sách đăng ký học viên
const getEnrollments = async () => {
  try {
    const response = await axiosInstance.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách đăng ký:", error);
    throw error;
  }
};

// Hàm lấy tất cả danh sách class có thể đăng ký được theo mã học viên và mã đăng ký
const getAvailableClasses = async (studentId, enrollmentId) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/available-classes`, {
      params: {
        studentId: studentId, // Mã học viên
        enrollmentId: enrollmentId || null, // Mã đăng ký (có thể null)
      },
    });
    return response.data; // Trả về danh sách lớp khả dụng
  } catch (error) {
    console.error("Lỗi khi lấy danh sách đăng ký:", error);
    throw error; // Ném lỗi để hàm gọi xử lý
  }
};

// Hàm lấy tất cả danh sách class có thể đăng ký được theo mã học viên
const getStudentsNotEnroll = async () => {
  try {
    const response = await axiosInstance.get(
      `${API_URL}/students/not-enrolled`
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách đăng ký:", error);
    throw error;
  }
};

// Hàm lấy thông tin chi tiết một đăng ký học viên theo ID
const getEnrollmentById = async (id) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi lấy thông tin đăng ký với ID: ${id}`, error);
    throw error;
  }
};

// Hàm tạo mới một đăng ký học viên
const createEnrollment = async (enrollmentData) => {
  try {
    const response = await axiosInstance.post(API_URL, enrollmentData);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tạo mới đăng ký:", error);
    throw error;
  }
};

// Hàm cập nhật thông tin đăng ký học viên
const updateEnrollment = async (id, enrollmentData) => {
  try {
    const response = await axiosInstance.put(
      `${API_URL}/${id}`,
      enrollmentData
    );
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi cập nhật thông tin đăng ký với ID: ${id}`, error);
    throw error;
  }
};

// Hàm xóa một đăng ký học viên theo ID
const deleteEnrollment = async (id) => {
  try {
    const response = await axiosInstance.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi xóa đăng ký với ID: ${id}`, error);
    throw error;
  }
};

const EnrollmentService = {
  getEnrollments,
  getAvailableClasses,
  getStudentsNotEnroll,
  getEnrollmentById,
  createEnrollment,
  updateEnrollment,
  deleteEnrollment,
};

export default EnrollmentService;
