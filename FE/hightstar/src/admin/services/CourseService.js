import axios from "axios";

// Cấu hình URL API chung
const API_URL = "http://localhost:8080/api/courses"; // Thay bằng URL thực tế của bạn

// Hàm lấy tất cả khóa học
const getCourses = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data; // Trả về dữ liệu khóa học
  } catch (error) {
    console.error("Lỗi khi lấy danh sách khóa học:", error);
    throw error;
  }
};

// Hàm lấy một khóa học theo ID
const getCourseById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data; // Trả về dữ liệu khóa học
  } catch (error) {
    console.error(`Lỗi khi lấy khóa học với ID: ${id}`, error);
    throw error;
  }
};

// Hàm thêm mới khóa học
const createCourse = async (courseData) => {
  try {
    const response = await axios.post(API_URL, courseData);
    return response.data; // Trả về dữ liệu khóa học vừa được tạo
  } catch (error) {
    console.error("Lỗi khi thêm mới khóa học:", error);
    throw error;
  }
};

// Hàm cập nhật khóa học
const updateCourse = async (id, courseData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, courseData);
    return response.data; // Trả về dữ liệu khóa học đã được cập nhật
  } catch (error) {
    console.error(`Lỗi khi cập nhật khóa học với ID: ${id}`, error);
    throw error;
  }
};

// Hàm xóa khóa học
const deleteCourse = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`); // Thực hiện xóa khóa học theo ID
  } catch (error) {
    console.error(`Lỗi khi xóa khóa học với ID: ${id}`, error);
    throw error;
  }
};

// Gán object vào một biến trước khi export
const CourseService = {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
};

export default CourseService;
