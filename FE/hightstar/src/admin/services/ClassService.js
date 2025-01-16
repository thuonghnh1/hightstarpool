import axiosInstance from "../../services/axiosInstance";
import { formatDateToDMY } from "../utils/FormatDate";

const API_URL = "/employee/classes";

// Hàm xử lý lỗi chung
const handleError = (error, message) => {
  console.error(message, error);
  throw error;
};

// Hàm lấy tất cả lớp học
const getClasses = async () => {
  try {
    const response = await axiosInstance.get(API_URL);
    const classes = response.data;

    // Chuyển đổi định dạng ngày giờ cho từng lớp học
    return classes.map((classEntity) => ({
      ...classEntity,
      startDate: formatDateToDMY(classEntity.startDate),
      endDate: formatDateToDMY(classEntity.endDate),
    }));
  } catch (error) {
    handleError(error, "Lỗi khi lấy danh sách lớp học:");
  }
};

// Hàm lấy lớp học theo ID
const getClassById = async (id) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/${id}`);
    const classEntity = response.data;

    // Chuyển đổi định dạng ngày giờ
    return {
      ...classEntity,
      startDate: formatDateToDMY(classEntity.startDate),
      endDate: formatDateToDMY(classEntity.endDate),
    };
  } catch (error) {
    // Xử lý lỗi khi không tìm thấy lớp học hoặc có lỗi khác
    handleError(error, `Lỗi khi lấy lớp học với ID: ${id}`);
  }
};

// Hàm lấy tên khóa học từ classStudentEnrollmentId
const getCourseNameByEnrollmentId = async (classStudentEnrollmentId) => {
  try {
    const response = await axiosInstance.get(
      `${API_URL}/enrollment/${classStudentEnrollmentId}/course-name`
    );
    return response.data; // Trả về tên khóa học
  } catch (error) {
    handleError(
      error,
      `Lỗi khi lấy tên khóa học với Enrollment ID: ${classStudentEnrollmentId}`
    );
  }
};

// Lấy tất cả lớp đã đăng ký của học viên
const getEnrolledClassesByStudent = async (studentId) => {
  try {
    const response = await axiosInstance.get(
      `${API_URL}/find-by-student/${studentId}`
    );
    return response.data;
  } catch (error) {
    handleError(
      error,
      `Lỗi khi lấy danh sách lớp đã đăng ký của học viên với ID: ${studentId}`
    );
  }
};

// Lấy tất cả bản đăng ký của 1 lớp học cụ thể
const getEnrollmentsByClassId = async (classId) => {
  try {
    const response = await axiosInstance.get(
      `${API_URL}/enrollments-by-class/${classId}`
    );
    return response.data;
  } catch (error) {
    handleError(
      error,
      `Lỗi khi lấy danh sách bản đăng ký của lớp học với ID: ${classId}`
    );
  }
};

// Hàm lấy tất cả lớp học
const getAvailableClassesForCourse = async (courseId, studentId) => {
  try {
    const response = await axiosInstance.get(
      `${API_URL}/available-classes-for-course`,
      {
        params: {
          courseId: courseId,
          studentId: studentId && studentId !== "" ? studentId : null, // Nếu không có studentId, gửi null
        },
      }
    );
    const classes = response.data;

    // Chuyển đổi định dạng ngày giờ cho từng lớp học
    return classes.map((classEntity) => ({
      ...classEntity,
      startDate: formatDateToDMY(classEntity.startDate),
      endDate: formatDateToDMY(classEntity.endDate),
    }));
  } catch (error) {
    handleError(error, "Lỗi khi lấy danh sách lớp học:");
  }
};

// Hàm tạo mới lớp học
const createClass = async (classRequest) => {
  try {
    const response = await axiosInstance.post(API_URL, classRequest);
    return response.data;
  } catch (error) {
    handleError(error, "Lỗi khi thêm mới lớp học:");
  }
};

// Hàm cập nhật lớp học
const updateClass = async (id, classRequest) => {
  try {
    const response = await axiosInstance.put(`${API_URL}/${id}`, classRequest);
    return response.data;
  } catch (error) {
    handleError(error, `Lỗi khi cập nhật lớp học với ID: ${id}`);
  }
};

// Hàm xóa lớp học
const deleteClass = async (id) => {
  try {
    await axiosInstance.delete(`${API_URL}/${id}`);
  } catch (error) {
    handleError(error, `Lỗi khi xóa lớp học với ID: ${id}`);
  }
};

// Hàm lấy giảng viên có sẵn theo thời gian đã chọn
const getAvailableTrainers = async (
  selectedTimeSlotIds,
  classId,
  startDate
) => {
  try {
    const response = await axiosInstance.post(
      `${API_URL}/available-trainers`,
      selectedTimeSlotIds,
      {
        params: {
          classId: classId || null, // Nếu không có classId, gửi null
          startDate: startDate, // Gửi ngày bắt đầu lớp
        },
      }
    );
    return response.data;
  } catch (error) {
    handleError(error, "Lỗi khi lấy danh sách giảng viên có sẵn:");
  }
};

// Gán object vào một biến trước khi export
const ClassService = {
  getClasses,
  getClassById,
  getCourseNameByEnrollmentId,
  getEnrolledClassesByStudent,
  getEnrollmentsByClassId,
  getAvailableClassesForCourse,
  createClass,
  updateClass,
  deleteClass,
  getAvailableTrainers,
};

export default ClassService;
