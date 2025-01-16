import axiosInstance from "../../services/axiosInstance";
import { formatDateToDMY, formatTime } from "../utils/FormatDate";

const API_URL = "/employee/attendances";

// Hàm lấy tất cả điểm danh
const getAttendances = async () => {
  try {
    const response = await axiosInstance.get(API_URL);
    const attendances = response.data;
    return attendances.map((attendance) => ({
      ...attendance,
      checkInTime: formatTime(attendance.checkInTime),
      checkOutTime: formatTime(attendance.checkOutTime),
      attendanceDate: formatDateToDMY(attendance.attendanceDate),
    }));
  } catch (error) {
    console.error("Lỗi khi lấy danh sách điểm danh:", error);
    throw error;
  }
};

// Hàm lấy tất cả điểm danh
const getAttendancesWithoutCheckOut = async () => {
  try {
    const response = await axiosInstance.get(`${API_URL}/without-checkout`);
    const attendances = response.data;
    return attendances.map((attendance) => ({
      ...attendance,
      checkInTime: formatTime(attendance.checkInTime),
      checkOutTime: formatTime(attendance.checkOutTime),
      attendanceDate: formatDateToDMY(attendance.attendanceDate),
    }));
  } catch (error) {
    console.error("Lỗi khi lấy danh sách khách trong hồ:", error);
    throw error;
  }
};

// Hàm lấy danh sách điểm danh của học viên ở các buổi học trong 1 lớp học
const getSessionAttendanceForStudent = async (classId, studentId) => {
  try {
    const response = await axiosInstance.get(
      `${API_URL}/session-attendance-for-student`,
      {
        params: {
          classId,
          studentId,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi lấy danh sách điểm danh`, error);
    throw error;
  }
};

// Hàm lấy một điểm danh theo ID
const getAttendanceById = async (id) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi lấy điểm danh với ID: ${id}`, error);
    throw error;
  }
};

// Hàm thêm mới điểm danh
const createAttendance = async (attendanceData) => {
  try {
    const response = await axiosInstance.post(API_URL, attendanceData);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi thêm mới điểm danh:", error);
    throw error;
  }
};

// Hàm cập nhật điểm danh
const updateAttendance = async (id, attendanceData) => {
  try {
    const response = await axiosInstance.put(
      `${API_URL}/${id}`,
      attendanceData
    );
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi cập nhật điểm danh với ID: ${id}`, error);
    throw error;
  }
};

// Hàm xóa điểm danh
const deleteAttendance = async (id) => {
  try {
    await axiosInstance.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error(`Lỗi khi xóa điểm danh với ID: ${id}`, error);
    throw error;
  }
};

// Hàm scan QR Code để ghi nhận điểm danh
const scanQRCode = async (ticketCode) => {
  try {
    const response = await axiosInstance.post(`${API_URL}/scan`, {
      ticketCode,
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi scan QR Code để điểm danh:", error);
    throw error.response ? error.response.data : new Error("Network Error");
  }
};

const AttendanceService = {
  getAttendances,
  getAttendancesWithoutCheckOut,
  getSessionAttendanceForStudent,
  getAttendanceById,
  createAttendance,
  updateAttendance,
  deleteAttendance,
  scanQRCode, // Thêm hàm scanQRCode vào service
};

export default AttendanceService;
