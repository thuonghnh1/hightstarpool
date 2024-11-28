import axiosInstance from "../../services/axiosInstance";
import { formatDateTimeToDMY } from "../utils/FormatDate";

const API_URL = "/admin/attendances";

// Hàm lấy tất cả điểm danh
const getAttendances = async () => {
    try {
        const response = await axiosInstance.get(API_URL);
        const attendances = response.data;

        return attendances.map((attendance) => ({
            ...attendance,
        }));
    } catch (error) {
        console.error("Lỗi khi lấy danh sách điểm danh:", error);
        throw error;
    }
};

// Hàm lấy một điểm danh theo ID
const getAttendanceById = async (id) => {
    try {
        const response = await axiosInstance.get(`${API_URL}/${id}`);
        const attendance = response.data;

        return {
            ...attendance,
        };
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
        const response = await axiosInstance.put(`${API_URL}/${id}`, attendanceData);
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

const AttendanceService = {
    getAttendances,
    getAttendanceById,
    createAttendance,
    updateAttendance,
    deleteAttendance,
};

export default AttendanceService;
