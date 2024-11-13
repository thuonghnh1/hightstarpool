import axiosInstance from "../../services/axiosInstance";

const API_URL = "/employee/tickets"; // URL thực tế của bạn

const getTickets = async () => {
  try {
    const response = await axiosInstance.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách vé:", error);
    throw error;
  }
};

const TicketService = {
  getTickets,
};

export default TicketService;
