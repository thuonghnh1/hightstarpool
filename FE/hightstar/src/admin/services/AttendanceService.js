// src/services/AttendanceService.js

import axiosInstance from "../../services/axiosInstance";
import { formatDateToDMY } from "../utils/FormatDate";

const API_URL = "/employee/attendances";

// Hàm lấy tất cả điểm danh
const getAttendances = async () => {
  try {
    const response = await axiosInstance.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách điểm danh:", error);
    throw error;
  }
};

// Hàm lấy tất cả điểm danh
const getAttendancesWithoutCheckOut = async () => {
  try {
    const response = await axiosInstance.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách khách trong hồ:", error);
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
const scanQRCode = async (qrCodeBase64) => {
  try {
    const response = await axiosInstance.post(`/admin/attendance/scan`, {
      qrCodeBase64,
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
  getAttendanceById,
  createAttendance,
  updateAttendance,
  deleteAttendance,
  scanQRCode, // Thêm hàm scanQRCode vào service
};

export default AttendanceService;
