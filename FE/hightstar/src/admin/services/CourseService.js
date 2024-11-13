import axiosInstance from "../../services/axiosInstance"; // Đường dẫn tới file axiosInstance

// Cấu hình URL API chung
const API_URL = "/admin/courses";

// Hàm lấy tất cả khóa học
const getCourses = async () => {
  try {
    const response = await axiosInstance.get(API_URL);
    return response.data; // Trả về dữ liệu khóa học
  } catch (error) {
    console.error("Lỗi khi lấy danh sách khóa học:", error);
    throw error; // Ném lỗi để các component gọi hàm này có thể xử lý tiếp
  }
};

// Hàm lấy một khóa học theo ID
const getCourseById = async (id) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi lấy khóa học với ID: ${id}`, error);
    throw error;
  }
};

// Hàm tạo khóa học mới
const createCourse = async (courseData, file) => {
  const formData = new FormData();
  formData.append("course", JSON.stringify(courseData));
  formData.append("file", file);

  try {
    const response = await axiosInstance.post(API_URL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi thêm mới khóa học:", error);
    throw error;
  }
};

// Hàm cập nhật khóa học
const updateCourse = async (id, courseData, file) => {
  const formData = new FormData();
  formData.append("course", JSON.stringify(courseData));
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
    console.error(`Lỗi khi cập nhật khóa học với ID: ${id}`, error);
    throw error;
  }
};

// Hàm xóa khóa học
const deleteCourse = async (id) => {
  try {
    await axiosInstance.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error(`Lỗi khi xóa khóa học với ID: ${id}`, error);
    throw error;
  }
};

const CourseService = {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
};

export default CourseService;
