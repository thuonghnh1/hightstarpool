import axiosInstance from "../../services/axiosInstance";

// Cấu hình URL API chung
const API_URL = "/admin/timeSlots";

// Hàm xử lý lỗi chung
const handleError = (error, message) => {
    console.error(message, error);
    throw error;
};

// Hàm lấy tất cả suất học
const getTimeSlots = async () => {
    try {
        const response = await axiosInstance.get(API_URL);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách suất học:", error);
        throw error;
    }
};

// Hàm lấy một suất học theo ID
const getTimeSlotById = async (id) => {
    try {
        const response = await axiosInstance.get(`${API_URL}/${id}`);
        const timeSlot = response.data;

        // Chuyển đổi định dạng ngày giờ
        return {
            ...timeSlot,
        };
    } catch (error) {
        handleError(error, `Lỗi khi lấy suất học với ID: ${id}`);
    }
};

// Hàm thêm mới suất học
const createTimeSlot = async (timeSlotData) => {
    try {
        const response = await axiosInstance.post(API_URL, timeSlotData);
        return response.data;
    } catch (error) {
        handleError(error, "Lỗi khi thêm mới suất học:");
    }
};

// Hàm cập nhật suất học
const updateTimeSlot = async (id, timeSlotData) => {
    try {
        const response = await axiosInstance.put(`${API_URL}/${id}`, timeSlotData);
        return response.data;
    } catch (error) {
        handleError(error, `Lỗi khi cập nhật suất học với ID: ${id}`);
    }
};

// Hàm xóa suất học
const deleteTimeSlot = async (id) => {
    try {
        await axiosInstance.delete(`${API_URL}/${id}`);
    } catch (error) {
        handleError(error, `Lỗi khi xóa suất học với ID: ${id}`);
    }
};

// Gán object vào một biến trước khi export
const TimeSlotService = {
    getTimeSlots,
    getTimeSlotById,
    createTimeSlot,
    updateTimeSlot,
    deleteTimeSlot,
};

export default TimeSlotService;
