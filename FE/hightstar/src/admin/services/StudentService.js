import axios from "axios";

// Cấu hình URL API chung
const API_URL = "http://localhost:8080/api/students"; // Thay bằng URL thực tế của bạn

// Hàm lấy tất cả học viên
const getStudents = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách học viên:", error);
        throw error;
    }
};

// Hàm lấy một học viên theo ID
const getStudentById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Lỗi khi lấy học viên với ID: ${id}`, error);
        throw error;
    }
};

// Hàm thêm mới học viên
const createStudent = async (studentData) => {
    try {
        const response = await axios.post(API_URL, studentData);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi thêm mới học viên:", error);
        throw error;
    }
};

// Hàm cập nhật học viên
const updateStudent = async (id, studentData) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, studentData);
        return response.data;
    } catch (error) {
        console.error(`Lỗi khi cập nhật học viên với ID: ${id}`, error);
        throw error;
    }
};

// Hàm xóa học viên
const deleteStudent = async (id) => {
    try {
        await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
        console.error(`Lỗi khi xóa học viên với ID: ${id}`, error);
        throw error;
    }
};

// Gán tất cả các hàm vào một object trước khi export
const studentService = {
    getStudents,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent,
};

export default studentService;
