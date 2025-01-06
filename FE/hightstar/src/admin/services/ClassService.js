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

// Hàm lấy tất cả lớp học
const getAvailableClassesForCourse = async (courseId) => {
  try {
    const response = await axiosInstance.get(
      `${API_URL}/available-classes/${courseId}`
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
  getAvailableClassesForCourse,
  createClass,
  updateClass,
  deleteClass,
  getAvailableTrainers,
};

export default ClassService;
