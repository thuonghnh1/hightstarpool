import axiosInstance from "../../services/axiosInstance";

// Cấu hình URL API chung
const API_URL = "/employee/orders";

// Hàm lấy tất cả order
const getOrders = async () => {
    try {
        const response = await axiosInstance.get(API_URL);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách đặt hàng:", error);
        throw error;
    }
};

// Hàm lấy một đơn hàng theo ID
const getOrderById = async (id) => {
    try {
        const response = await axiosInstance.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Lỗi khi lấy đơn hàng với ID: ${id}`, error);
        throw error;
    }
};

// Hàm cập nhật đơn hàng
const updateOrder = async (id, orderData) => {
    try {
        const response = await axiosInstance.put(`${API_URL}/${id}`, orderData);
        return response.data;
    } catch (error) {
        console.error(`Lỗi khi cập nhật đơn hàng với ID: ${id}`, error);
        throw error;
    }
};

// Hàm lấy chi tiết đơn hàng
const getOrderDetails = async (orderId) => {
    try {
        const response = await axiosInstance.get(`${API_URL}/${orderId}/details`);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy chi tiết đơn hàng:", error);
        throw error; // Thêm `throw error` để các component gọi hàm này có thể xử lý lỗi
    }
};

// Gán tất cả các hàm vào một object trước khi export
const orderService = {
    getOrders,
    getOrderById,
    updateOrder,
    getOrderDetails
};

export default orderService;
